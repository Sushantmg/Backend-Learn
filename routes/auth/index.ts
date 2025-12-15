const express = require("express");
const {
  login,
  userRegister,
  staffRegister,
  getMe,
  changePassword,
} = require("./handler");
const {
  validateToken,
  superUserOnly,
  staffOnly,
  allowRoles,
} = require("../../middleware/authMiddleware");

const router = express.Router();


router.post("/login", login);
router.post("/register", userRegister);


router.post("/staff-register", validateToken, superUserOnly, staffRegister);


router.get("/me", validateToken, getMe);
router.post("/change-password", validateToken, changePassword);

router.get("/staff-dashboard", validateToken, staffOnly, (req, res) => {
  res.json({ message: "Welcome, staff or superuser!" });
});


router.get("/admin-only", validateToken, allowRoles("SUPERUSER"), (req, res) => {
  res.json({ message: "Welcome, superuser!" });
});

module.exports = router;
