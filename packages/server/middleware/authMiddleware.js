const jwt = require("jsonwebtoken");

//if token not found - returns 401 Unauthorized
exports.requireAuth = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Optional middleware - doesn't return error if no token
exports.optionalAuth = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        // Invalid token but continue anyway
        next();
    }
};
