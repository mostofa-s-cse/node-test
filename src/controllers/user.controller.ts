import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import {
  getAllUsersService,
  getMeService,
  deleteUserService,
  searchUserService,
} from "../services/user.service";

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const user = await getMeService(req.user.id);
  res.json({ user });
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await getAllUsersService();
  res.json({ users });
};

export const deleteUser = async (req: Request, res: Response) => {
  await deleteUserService(req.params.id);
  res.json({ message: "User deleted" });
};

export const searchUsers = async (req: Request, res: Response) => {
  const { q } = req.query;
  const users = await searchUserService(q as string);
  res.json({ users });
};
