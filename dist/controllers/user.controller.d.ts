import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
export declare const getMe: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllUsers: (_req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export declare const searchUsers: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map