import { Request, Response } from "express";
import {
  getAllUsersService,
  deleteUserService,
  searchUserService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service";

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await getAllUsersService();
  res.json({ success: true, message: "All users retrieved successfully", users });
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await getUserByIdService(req.params.id);
  res.json({ success: true, message: "User retrieved successfully", user });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await updateUserService(req.params.id, req.body);
  res.json({ success: true, message: "User updated successfully", user });
};


export const deleteUser = async (req: Request, res: Response) => {
  await deleteUserService(req.params.id);
  res.json({ success: true, message: "User deleted successfully" });
};

export const searchUsers = async (req: Request, res: Response) => {
  const { q } = req.query;
  const users = await searchUserService(q as string);
  res.json({ success: true, message: "Users search completed", users });
};
