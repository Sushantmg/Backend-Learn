const prisma = require("../../prisma-config");
const bcrypt = require("bcryptjs");


const updateRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role)
      return res.status(400).json({ error: "userId and role are required" });

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
    });

    res.json({
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json({ message: "All users fetched", user: req.user, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User fetched", user: req.user, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const postUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" }, // always USER
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ message: "User created", user: req.user, data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.json({ message: "User updated", user: req.user, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "User deleted", user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const getStaffDashboard = async (req, res) => {
  try {
    res.json({
      message: "Welcome to the STAFF dashboard",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
  getStaffDashboard,
  updateRole,
  
};
