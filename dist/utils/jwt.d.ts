import { JwtPayload, SignOptions } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
    id: string;
    role?: string;
}
export declare const generateToken: (payload: TokenPayload, expiresIn?: SignOptions["expiresIn"]) => string;
export declare const generateRefreshToken: (payload: TokenPayload, expiresIn?: SignOptions["expiresIn"]) => string;
export declare const verifyToken: (token: string) => TokenPayload;
export declare const verifyRefreshToken: (token: string) => TokenPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map