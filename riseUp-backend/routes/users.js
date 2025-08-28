const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      type: type || 'user'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there's already a pending request
    const existingRequest = await PasswordResetRequest.findOne({ 
      email, 
      status: 'pending' 
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'Password reset request already pending. Please wait for admin approval.' 
      });
    }

    // Create new password reset request
    const resetRequest = new PasswordResetRequest({ email });
    await resetRequest.save();

    res.json({ 
      message: 'Password reset request submitted successfully. Please wait for admin approval.',
      token: resetRequest.token // For prototype - in real app, this would be sent via email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get password reset requests (admin only)
router.get('/password-reset-requests', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const requests = await PasswordResetRequest.find({ status: 'pending' })
      .sort({ requestedAt: -1 })
      .populate('approvedBy', 'name email');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve password reset request (admin only)
router.put('/approve-password-reset/:requestId', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { requestId } = req.params;
    const resetRequest = await PasswordResetRequest.findById(requestId);

    if (!resetRequest) {
      return res.status(404).json({ message: 'Password reset request not found' });
    }

    if (resetRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Update request status
    resetRequest.status = 'approved';
    resetRequest.approvedAt = new Date();
    resetRequest.approvedBy = req.user.userId;
    await resetRequest.save();

    res.json({ 
      message: 'Password reset request approved successfully',
      token: resetRequest.token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Find the reset request
    const resetRequest = await PasswordResetRequest.findOne({ 
      token, 
      status: 'approved' 
    });

    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if token is expired
    if (resetRequest.expiresAt < new Date()) {
      resetRequest.status = 'expired';
      await resetRequest.save();
      return res.status(400).json({ message: 'Token has expired' });
    }

    // Find user and update password
    const user = await User.findOne({ email: resetRequest.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    // Mark request as completed
    resetRequest.status = 'completed';
    resetRequest.completedAt = new Date();
    await resetRequest.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
