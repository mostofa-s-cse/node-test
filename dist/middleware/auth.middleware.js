"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowRoles = exports.isAuthenticated = void 0;
const jwt_1 = require("../utils/jwt");
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.isAuthenticated = isAuthenticated;
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        if (!roles.includes(req.user.role || "")) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.allowRoles = allowRoles;
//# sourceMappingURL=auth.middleware.js.map