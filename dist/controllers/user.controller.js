"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.deleteUser = exports.getAllUsers = exports.getMe = void 0;
const user_service_1 = require("../services/user.service");
const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await (0, user_service_1.getMeService)(req.user.id);
    res.json({ user });
};
exports.getMe = getMe;
const getAllUsers = async (_req, res) => {
    const users = await (0, user_service_1.getAllUsersService)();
    res.json({ users });
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    await (0, user_service_1.deleteUserService)(req.params.id);
    res.json({ message: "User deleted" });
};
exports.deleteUser = deleteUser;
const searchUsers = async (req, res) => {
    const { q } = req.query;
    const users = await (0, user_service_1.searchUserService)(q);
    res.json({ users });
};
exports.searchUsers = searchUsers;
//# sourceMappingURL=user.controller.js.map