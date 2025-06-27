function authorizeUserAction() {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {

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

module.exports = {
    missingFieldsResponse,
};