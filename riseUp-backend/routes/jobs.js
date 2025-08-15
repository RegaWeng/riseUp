const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

//Get all jobs
router.get('/', async (req,res) => {
    try {
        const jobs = await Job.find({ isActive: true});
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;