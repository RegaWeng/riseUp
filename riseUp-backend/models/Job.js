const mongoose = require('mongoose');

const JOB_CATEGORIES =[
    "Cleaning & Maintenance",
    "Retail & Sales",
    "Food Services",
    "Warehouse & Logistics",
    "Customer Service",
    "Delivery & Transportation",
    "Healthcare Support",
    "Administrative Assistant",
    "Security",
    "Other"
];

const jobSchema = new mongoose.Schema({
    
    title : {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    jobType: {
        type: String,
        required: true,
        enum: JOB_CATEGORIES
    },

    location: {
        type: String,
        required: true
    },

    workingHours: {
        weekday: {
            type: String,
            required: true
        },
        weekend: {
            type: String,
            required: true
        }
    },

    learnableSkills: {
        type: [String],
        required: false
    },

    minimumSalary: {
        type: String,
        required: true
    },

    experienceRequired: {
        type: String,
        required: false
    },

    trainingProvided: {
        type: String,
        required: false
    },

    requiredSkills: {
        type: [String],
        required: true,
        validate: {
            validator: function(skills) {
                return skills.length <= 3 &&
                    skills.includes("Basic English") &&
                    skills.every(skill => skill.trim().length)
            }
        }
    },

    datePosted: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    }

});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;