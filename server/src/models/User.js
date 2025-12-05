const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    profile: {
        firstName: String,
        lastName: String,
        bio: {
            type: String,
            maxlength: 500
        },
        avatar: {
            type: String,
            default: null
        },
        location: {
            city: String,
            country: String
        },
        socialLinks: {
            linkedin: String,
            github: String,
            portfolio: String
        }
    },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    swapHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Swap'
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        select: false
    },
    verificationTokenExpires: Date,
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: Date,
    lastActive: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateVerificationToken = function() {
    const token = crypto.randomBytes(20).toString('hex')
    this.verificationToken = crypto.createHash('sha256').update(token).digest('hex')
    this.verificationTokenExpires = new Date ( Date.now() + (parseInt(process.env.VERIFICATION_TOKEN_EXPIRE_MS, 10) || 24 * 60 * 60 * 1000)
    )
    return token
}

userSchema.statics.findByVerificationToken = function(plainToken) {
    const hash = crypto.createHash('sha256').update(plainToken).digest('hex')
    return this.findOne({
        verificationToken: hash,
        verificationTokenExpires: { $gt: Date.now() }
    })
}

userSchema.statics.verifyByVerificationToken = async function(plainToken) {
    const user = await this.findByVerificationToken(plainToken)
    if (!user) return null
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()
    return user
}

userSchema.methods.generateResetPasswordToken = function() {
    const token = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetPasswordExpires = new Date ( Date.now() + (parseInt(process.env.RESET_PASSWORD_EXPIRE_MS, 10) || 60 * 60 * 1000)
    )
    return token
}

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password
        delete ret.verificationToken
        delete ret.verificationTokenExpires
        delete ret.resetPasswordExpires
        delete ret.resetPasswordToken
        delete ret.__v
        return ret
    }
})

userSchema.set('toObject', userSchema.get('toJSON'))

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate()
    if (!update) return next()
    
    let password = update.password
    if(!password && update.$set) password = update.$set.password
    if(!password) return next()
    
    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12
        const salt = await bcrypt.genSalt(saltRounds)
        const hashed = await bcrypt.hash(password, salt)
        if (update.password) update.password = hashed
        else update.$set = { ...(update.$set || {}), password: hashed}
        this.setUpdate(update)
        return next()
    } catch (error) {
        return next(error)
    }
})
userSchema.index({ email: 1}, { unique: true })
userSchema.index({ username: 1 }, { unique: true })

module.exports = mongoose.model('User', userSchema);
                