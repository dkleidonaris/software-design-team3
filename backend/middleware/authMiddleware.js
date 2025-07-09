const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

const authorizePersonalUserActionMiddleware = async (req, res, next) => {
    try {

        if (!req.params.userId) {
            return res.status(401).json({ error: 'Unauthorized: No user info in token' });
        }

        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ error: 'Forbidden: You are not allowed to perform this action' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    authMiddleware,
    authorizePersonalUserActionMiddleware
};