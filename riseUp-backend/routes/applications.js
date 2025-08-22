const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

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

// Get all applications (for employers and admins)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.type === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate('jobId', 'title company location');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a specific job (employer only)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'employer' && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email')
      .populate('jobId', 'title company location');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications (for job seekers)
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId', 'title company location minimumSalary');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new application (job seekers only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'user') {
      return res.status(403).json({ message: 'Only job seekers can apply' });
    }

    const { jobId } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = new Application({
      jobId,
      userId: req.user.userId
    });

    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('userId', 'name email')
      .populate('jobId', 'title company location');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update application status (employers and admins only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.type !== 'employer' && req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title company location');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete application (user can delete their own, employers can delete any)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Users can only delete their own applications
    if (req.user.type === 'user' && application.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
