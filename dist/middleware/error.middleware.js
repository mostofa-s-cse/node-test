"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (_req, res) => {
    res.status(404).json({ message: "Page Not Found" });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map