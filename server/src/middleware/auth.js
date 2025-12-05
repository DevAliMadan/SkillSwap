const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
        let token
        const authHeader = req.headers.authorization || (req.cookies && req.cookies.token)
        if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1]
        else if (req.cookies && req.cookies.token) token = req.cookies.token

        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: 'Not autherized, token missing'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select('-password -verificationToken - resetPasswordToken')
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, user not found'
            })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized, token invalid or expired' }) 
    }
}

const requireVerified = (req, res, next) =>{
    if (!req.user) return res.status(401).json({
        success: false,
        error: 'Not authorized'
    })
    if (!req.user.isVerified) return res.status(403).json({
        success: false,
        error: 'Email not verified'
    })
    next()
}

const authorize = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({
        success: false,
        error: 'Not authorized'
    })
    if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({
        success: false,
        error: 'Forbidden'
    })
    next()
}

module.exports = {
    protect,
    requireVerified,
    authorize
}