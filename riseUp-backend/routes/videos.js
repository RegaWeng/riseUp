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

// GET single video by ID
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

// POST create new video
router.post('/', async (req, res) => {
    try {
        const video = new Video(req.body);
        const newVideo = await video.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update video by ID
router.put('/:id', async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE video by ID (soft delete - sets isActive to false)
router.delete('/:id', async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (video) {
            res.json({ message: 'Video deleted successfully' });
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search videos by category
router.get('/search/category/:category', async (req, res) => {
    try {
        const videos = await Video.find({ 
            category: { $regex: req.params.category, $options: 'i' },
            isActive: true 
        });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search videos by skills gained
router.get('/search/skills/:skill', async (req, res) => {
    try {
        const videos = await Video.find({ 
            skillsGained: { $regex: req.params.skill, $options: 'i' },
            isActive: true 
        });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;