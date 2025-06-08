const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const rateLimiter = require('express-rate-limit');
const { missingFieldResponse } = require('../utils/responses');
const { authMiddleware } = require('../middleware/authMiddleware');

const invalidCredentialsResponse = (res) => res.status(401).json({ error: "Invalid credentials", errorType: "invalidCredentials" });

const loginLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, //5 tries in each windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const resetTime = req.rateLimit?.resetTime;

        const now = new Date();
        const retryAfterSec = resetTime ? Math.ceil((resetTime - now) / 1000) : options.windowMs / 1000;

        res.status(429).json({
            error: "Too many login attempts",
            retryAfterSeconds: retryAfterSec,
            message: `Please try again in ${retryAfterSec} seconds`
        });
    }
});

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return missingFieldResponse(res, 'Email');
        }

        if (!password) {
            return missingFieldResponse(res, 'Password');

        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return invalidCredentialsResponse(res);
        }

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordMatch) {
            return invalidCredentialsResponse(res);
        }

        accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({ accessToken: accessToken });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

router.get('/status', authMiddleware, (req, res) => {
    res.status(200).json({ loggedIn: true, user: req.user });
});

module.exports = router;