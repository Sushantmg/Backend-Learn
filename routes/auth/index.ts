import { Router, Request, Response } from "express";
import {
  login,
  userRegister,
  staffRegister,
  getMe,
  changePassword,
} from "./handler";

import {
  validateToken,
  superUserOnly,
  staffOnly,
  allowRoles,
} from "../../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/register", userRegister);
router.post("/verify-registration-otp");

router.post("/staff-register", validateToken, superUserOnly, staffRegister);

router.get("/me", validateToken, getMe);
router.post("/change-password", validateToken, changePassword);

router.get(
  "/staff-dashboard",
  validateToken,
  staffOnly,
  (req: Request, res: Response) => {
    res.json({ message: "Welcome, staff or superuser!" });
  }
);

router.get(
  "/admin-only",
  validateToken,
  allowRoles("SUPERUSER"),
  (req: Request, res: Response) => {
    res.json({ message: "Welcome, superuser!" });
  }
);

export default router;
