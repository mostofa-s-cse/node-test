import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Prisma database connected successfully.");
  } catch (err) {
    console.error("Prisma database connection failed:", err);
  }
}

connectPrisma();

export default prisma; 