const rateLimiter = require('express-rate-limit');

const apiRateLimiter = rateLimiter({
    windowMs: 1 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const resetTime = req.rateLimit?.resetTime;

        const now = new Date();
        const retryAfterSec = resetTime ? Math.ceil((resetTime - now) / 1000) : options.windowMs / 1000;

        res.status(429).json({
            error: "Too many calls",
            retryAfterSeconds: retryAfterSec,
            message: `Please try again in ${retryAfterSec} seconds`
        });
    }
});

module.exports = { apiRateLimiter };