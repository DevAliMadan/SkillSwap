const User = require('../model/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE}
    )
}

const register = async (req, res) => {
    
    try {
        const { username, email, password, firstName, lastName } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'username, email and password are required'
            })
        }
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exsists with this username or email'
            })
        }

        const verificationTokenPlain = crypto.randomBytes(20).toString('hex')
        const verificationTokenHash = crypto.createHash('sha256').update(verificationTokenPlain).digest('hex')
        const verificationTokenExpires = new Date(Date.now() + (process.env.VERIFICATION_TOKEN_EXPIRE_MS ? parseInt(process.env.VERIFICATION_TOKEN_EXPIRE_MS, 10) : 24 * 60 * 60 * 1000))
        
        const user = await User.create({
            username,
            email,
            password,
            profile: { firstName, lastName },
            verificationToken: verificationTokenHash,
            verificationTokenExpires
        })

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationTokenPlain}`
        await sendEmail({
            to: email,
            subject: 'Welcome to SkillSwap - Verify You Email',
            html: `
                <p>Welcome to SkillSwap!</p>
                <p>Please click the link below to verify you email:</p>
                <p><a href="${verifyUrl}"Verify Email</p>
            `
        })

        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.massage
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password} = req.body

        if ( !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            })
        }

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(491).json({
                success: false,
                error: 'Invalid credential'
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credential'
            })
        }

        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile,
                skills: user.skills
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.massage
        })
    }
}

const verifyEmail = async (req, res) => {
    
    try {
        const { token } = req.params
        const tokenHash = crypto.createHash('sha256')

        const user = await User.findOne({ 
            verificationToken: tokenHash, 
            verificationTokenExpires: {$gt: Date.now()}
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid verification token'
            })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()

        res.json({
            success: false,
            massage: 'Email verified successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.massage
        })
    }
}
module.exports = {
    register,
    login,
    verifyEmail
}