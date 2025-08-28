const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  token: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'expired'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
});

// Generate unique token before saving
passwordResetRequestSchema.pre('save', function(next) {
  if (this.isNew && !this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Index for faster queries
passwordResetRequestSchema.index({ email: 1, status: 1 });
passwordResetRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetRequest = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);

module.exports = PasswordResetRequest;
