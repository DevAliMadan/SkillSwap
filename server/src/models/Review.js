const mongoose = require('mongoose');

const reviewSchema  = new mongoose.Schema({
    swap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Swap',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        communication: {
            type: Number,
            min: 1,
            max: 5
        },
        skillLevel: {
            type: Number,
            min: 1,
            max: 5
        },
        punctuality: {
            type: Number,
            min: 1,
            max: 5
        },
        teaching: {
            type: Number,
            min: 1,
            max: 5
        }

    },
    comment: {
        type: String,
        maxlength: 500
    },
    wouldRecommend: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

reviewSchema.index({})

module.exports = mongoose.model('Review', reviewSchema)