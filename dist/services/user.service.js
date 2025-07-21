"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserService = exports.deleteUserService = exports.getAllUsersService = exports.getMeService = void 0;
const client_1 = require("@prisma/client");
const appError_1 = require("../utils/appError");
const prisma = new client_1.PrismaClient();
const getMeService = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new appError_1.AppError("User not found", 404);
    return user;
};
exports.getMeService = getMeService;
const getAllUsersService = async () => {
    return prisma.user.findMany();
};
exports.getAllUsersService = getAllUsersService;
const deleteUserService = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new appError_1.AppError("User not found", 404);
    return prisma.user.delete({ where: { id } });
};
exports.deleteUserService = deleteUserService;
const searchUserService = async (query) => {
    return prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        },
    });
};
exports.searchUserService = searchUserService;
//# sourceMappingURL=user.service.js.map