import express from "express";
import {
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
  getStaffDashboard,
  updateRole,
} from "./handler";

import { validateToken, allowRoles } from "../../middleware/authMiddleware";

import { validationMiddleware } from "../../middleware/validationMiddleware";
import { userSchema } from "../../utils/schema";

const router = express.Router();

router.get("/", validateToken, getAllUsers);
router.get("/:id", validateToken, getUserById);
router.get("/staff-dashboard", validateToken, allowRoles("STAFF"), getStaffDashboard);

router.post("/", validateToken, allowRoles("SUPERUSER"), validationMiddleware(userSchema), postUser);
router.put("/:id", validateToken, allowRoles("SUPERUSER"), updateUser);
router.delete("/:id", validateToken, allowRoles("SUPERUSER"), deleteUser);
router.put("/update-role", validateToken, allowRoles("SUPERUSER"), updateRole);

export default router;
