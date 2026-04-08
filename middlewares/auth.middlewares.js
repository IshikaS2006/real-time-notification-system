import jwt from "jsonwebtoken";

export const logSecurityEvent = (eventType, userId, message, ipAddress) => {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY] ${timestamp} | Event: ${eventType} | User: ${userId || 'Unknown'} | IP: ${ipAddress} | ${message}`);
};

export const verifyJWT = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            logSecurityEvent('NO_TOKEN', null, 'Request without JWT token', req.ip);
            return res.status(401).json({ message: "Token not found. Please login first." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        logSecurityEvent('INVALID_TOKEN', null, `Invalid or expired JWT: ${error.message}`, req.ip);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
