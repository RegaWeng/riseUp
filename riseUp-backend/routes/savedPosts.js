const express = require('express');
const router = express.Router();
const SavedPost = require('../models/SavedPost');

// GET all saved posts for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const savedPosts = await SavedPost.find({ userId: req.params.userId });
        res.json(savedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST save a new post
router.post('/', async (req, res) => {
    try {
        const savedPost = new SavedPost(req.body);
        const newSavedPost = await savedPost.save();
        res.status(201).json(newSavedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;