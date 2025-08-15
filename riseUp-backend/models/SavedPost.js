const mongoose = require('mongoose');

const SAVED_POST_TYPES = [
  "job",
  "video"
];

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  postType: {
    type: String,
    required: true,
    enum: SAVED_POST_TYPES
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'postType'
  },
  notes: {
    type: String,
    required: false
  },
  dateSaved: {
    type: Date,
    default: Date.now
  }
});

const SavedPost = mongoose.model('SavedPost', savedPostSchema);

module.exports = SavedPost;