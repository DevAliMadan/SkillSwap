const mongoose = require('mongoose');

const swapSchema  = new mongoose.Schema({
    requester: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        }
    },
    provider: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            require: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    details: {
        duration: {
            hours: Number,
            sessions: Number 
        },
        schedule: [{
            date: Date,
            duration: Number,
            completed: {
                type: Boolean,
                default: false
            }
        }],
        terms: String,
        notes: String
    },
    message: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    reviews: {
        fromRequester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        },
        fromProvider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    },
    startDate: Date,
    endDate: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    udatedAt: {
        type: Date,
        default: Date.now,
    }

})

swapSchema.index({})

module.exports = mongoose.model('Swap', swapSchema)