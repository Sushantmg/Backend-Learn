const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
  getStaffDashboard,
  updateRole,
} = require("./handler");

const { validateToken, allowRoles } = require("../../middleware/authMiddleware");
const { validationMiddleware } = require("../../middleware/validationMiddleware");
const { userSchema } = require("../../utils/schema");


router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


router.get("/", validateToken, getAllUsers);


router.get("/:id", validateToken, getUserById);

router.get("/staff-dashboard", validateToken, allowRoles("STAFF"), getStaffDashboard);


router.post("/", validateToken, allowRoles("SUPERUSER"),validationMiddleware(userSchema), postUser);

router.put("/:id", validateToken, allowRoles("SUPERUSER"), updateUser);

router.delete("/:id", validateToken, allowRoles("SUPERUSER"), deleteUser);

router.put("/update-role", validateToken, allowRoles("SUPERUSER"), updateRole);

module.exports = router;
