const mongoose = require('mongoose');

const VIDEO_CATEGORIES = [
  "Customer Service",
  "Basic Computer Skills", 
  "Communication",
  "Time Management",
  "Safety & Security",
  "Equipment Operation",
  "Cash Handling",
  "Inventory Management",
  "Teamwork",
  "Problem Solving"
];

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: VIDEO_CATEGORIES
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skillsGained: {
    type: [String],
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  dateUploaded: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;