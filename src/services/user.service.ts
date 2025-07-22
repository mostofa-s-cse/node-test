import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

export const getAllUsersService = async () => {
  return prisma.user.findMany();
};

export const getUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const updateUserService = async (id: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.update({ where: { id }, data });
};

export const deleteUserService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.delete({ where: { id } });
};

export const searchUserService = async (query: string) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
  });
};
