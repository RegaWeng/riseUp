const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find({ isActive: true });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;