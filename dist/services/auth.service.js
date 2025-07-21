"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshUserToken = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const prisma = new client_1.PrismaClient();
const registerUser = async (name, email, password) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new appError_1.AppError("Email already registered", 400);
    const hashed = await bcrypt_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashed },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new appError_1.AppError("User not found", 404);
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new appError_1.AppError("Invalid credentials", 401);
    const accessToken = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
    const refreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
    return { user, accessToken, refreshToken };
};
exports.loginUser = loginUser;
const refreshUserToken = async (token) => {
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user)
            throw new appError_1.AppError("User not found", 404);
        const newAccessToken = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        return { accessToken: newAccessToken };
    }
    catch (err) {
        throw new appError_1.AppError("Invalid refresh token", 403);
    }
};
exports.refreshUserToken = refreshUserToken;
const logoutUser = () => {
    // In production, you'd handle token blacklist here
    return { message: "Logged out successfully (client should delete tokens)" };
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.service.js.map