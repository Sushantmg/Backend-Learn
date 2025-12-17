import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

// -------------------------
// Custom JWT payload (STRING ID)
// -------------------------
export interface CustomJwtPayload extends JwtPayload {
  id: string; // ✅ Prisma / Mongo uses string
  email: string;
  role: "USER" | "STAFF" | "SUPERUSER";
}

// -------------------------
// ✅ EXTEND EXPRESS REQUEST (THIS WAS MISSING)
// -------------------------
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: "USER" | "STAFF" | "SUPERUSER";
    };
  }
}

// -------------------------
// Validate JWT Token Middleware
// -------------------------
export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

    // ✅ Attach user safely
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error("validateToken error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// -------------------------
// Role Guards
// -------------------------
export const superUserOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "SUPERUSER") return next();
  return res.status(403).json({ error: "Superuser only" });
};

export const staffOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "STAFF" || req.user?.role === "SUPERUSER") {
    return next();
  }
  return res.status(403).json({ error: "Staff only" });
};

export const allowRoles = (...roles: CustomJwtPayload["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
