import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

// -------------------------
// Custom JWT payload
// -------------------------
interface CustomJwtPayload extends JwtPayload {
  id: number;
  role: "USER" | "STAFF" | "SUPERUSER";
}

// -------------------------
// Extend Express Request
// -------------------------
declare module "express" {
  interface Request {
    user?: CustomJwtPayload;
    role?: CustomJwtPayload["role"];
    user_id?: number;
  }
}

// -------------------------
// Validate JWT Token Middleware
// -------------------------
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization format invalid" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    let decoded: CustomJwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Token invalid" });
    }

    req.user = decoded;
    req.role = decoded.role;
    req.user_id = decoded.id;

    next();
  } catch (error: any) {
    console.error("validateToken error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------------
// Role-based middleware
// -------------------------
export const superUserOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.role) return res.status(401).json({ error: "Valid token not found" });
  if (req.role === "SUPERUSER") return next();
  return res.status(403).json({ error: "Forbidden: Superuser only" });
};

export const staffOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.role) return res.status(401).json({ error: "Valid token not found" });
  if (req.role === "STAFF" || req.role === "SUPERUSER") return next();
  return res.status(403).json({ error: "Forbidden: Staff only" });
};

// -------------------------
// Generic role guard
// -------------------------
export const allowRoles = (...roles: CustomJwtPayload["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
