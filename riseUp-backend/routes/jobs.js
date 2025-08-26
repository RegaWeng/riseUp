const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update job by ID
router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE job by ID (hard delete - permanently removes from database)
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (job) {
            res.json({ message: 'Job permanently deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search jobs by company
router.get('/search/company/:company', async (req, res) => {
    try {
        const jobs = await Job.find({ 
            company: { $regex: req.params.company, $options: 'i' },
            isActive: true 
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search jobs by location
router.get('/search/location/:location', async (req, res) => {
    try {
        const jobs = await Job.find({ 
            location: { $regex: req.params.location, $options: 'i' },
            isActive: true 
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;