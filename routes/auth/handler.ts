const { PrismaClient } = require("@prisma/client"); // Correct import
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Email/Password does not match" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Email/Password does not match" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      result: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}


async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // role is optional now, default USER will be used
      },
    });

    console.log("✅ New user created:", newUser);
    res.status(201).json({ result: "Registration Successful", user: newUser });
  } catch (error) {
    console.error("💥 Registration Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}


async function staffRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Staff with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF", // Explicitly set STAFF
      },
    });

    res.status(201).json({
      result: "Staff Registration Successful",
      user: newStaff,
    });
  } catch (error) {
    console.error("Staff Registration Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}


async function getMe(req, res) {
  try {
    const id = req.user_id; 
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}


async function changePassword(req, res) {
  try {
    const id = req.user_id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: "Both old and new password are required" });

    const user = await prisma.user.findUnique({ where: { id } });
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect)
      return res.status(400).json({ error: "Your old password does not match" });

    if (oldPassword === newPassword)
      return res.status(400).json({ error: "Old and new password cannot be the same" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ where: { id }, data: { password: hashedNewPassword } });

    res.json({ result: "Password successfully changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  login,
  userRegister,
  staffRegister,
  getMe,
  changePassword,
};
