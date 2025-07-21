import { Request, Response, NextFunction } from "express";
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (_req: Request, res: Response) => void;
//# sourceMappingURL=auth.controller.d.ts.map