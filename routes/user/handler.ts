import { Request, Response } from "express";
import prisma from "../../prisma-config"; // Convert require → import
import bcrypt from "bcryptjs";

// -------------------------
// UPDATE ROLE
// -------------------------
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      res.status(400).json({ error: "userId and role are required" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
    });

    res.json({
      message: "User role updated successfully",
      updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------
// GET ALL USERS
// -------------------------
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        id: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ result: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// -------------------------
// GET USER BY ID
// -------------------------
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User fetched",
      user: req.user, // this comes from middleware
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// POST USER
// -------------------------
export const postUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({
      message: "User created",
      user: req.user,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// UPDATE USER
// -------------------------
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.json({
      message: "User updated",
      user: req.user,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// DELETE USER
// -------------------------
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "User deleted",
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// STAFF DASHBOARD
// -------------------------
export const getStaffDashboard = async (req: Request, res: Response): Promise<void> => {
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
