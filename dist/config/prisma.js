"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function connectPrisma() {
    try {
        await prisma.$connect();
        console.log("Prisma database connected successfully.");
    }
    catch (err) {
        console.error("Prisma database connection failed:", err);
    }
}
connectPrisma();
exports.default = prisma;
//# sourceMappingURL=prisma.js.map