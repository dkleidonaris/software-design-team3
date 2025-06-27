const router = require('express').Router();
const rateLimiter = require('express-rate-limit');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    login,
    checkAuthStatus
} = require('../controllers/authController');

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

router.post('/login', loginLimiter, login);

router.get('/status', authMiddleware, checkAuthStatus);

module.exports = router;