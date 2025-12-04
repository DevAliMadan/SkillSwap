const User = require('../model/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const { profile } = require('console')

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE}
    )
}

const register = async (req, res) => {
    
    try {
        const { username, email, password, fistName, lastName } = req.body

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exsist with this username or email'
            })
        }

        const verificationToken = crypto.randomBytes(20).toString('hex')

        const user = await User.craete({
            username,
            email,
            password,
            profile: { fistName, lastName },
            verificationToken
        })

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Welcome to SkillSwap - Verify You Email',
            html: `
                Welcome to SkillSwap!
                Please click the link below to verify you email:
                Verify Email
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