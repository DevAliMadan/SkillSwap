const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Programming',
            'Design',
            'Marketing',
            'Writing',
            'Music',
            'Languages',
            'Business',
            'Photogtaphy',
            'Cooking',
            'Fitness',
            'Art',
            'Other'
        ]
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    level: {
        type: String,
        required: true,
        enum: ['Begineer', 'Intermediate', 'Advanced', 'Expert']
    },
    tags: {
        type: String,
        lowercase: true
    },
    images: [{
        type: String
    }],
    availability: {
        hoursPerWeek:{
            type: Number,
            min: 1,
            max: 40
        },
        preferredDays: [{
            type: String,
            enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }],
        timezone: String
    },
    lookingFor: [{
        category: String,
        description: String
    }],
    isActive: {
        tyoe: Boolean,
        default: true
    },
    views: {
        type: Number,
        default:  0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    uupdatedAt: {
        type: Date,
        default: Date.now
    }
})

skillSchema.index({ title: 'text', description: 'text', tags: 'text'})

module.exports = mongoose.model('Skill', skillSchema)