import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

// Define the type for your payload
interface TokenPayload extends JwtPayload {
  id: string;
  role?: string; // optional if not always present
}

export const generateToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "15m"
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "7d"
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

