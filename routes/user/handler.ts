import { Request, Response } from "express";
import prisma from "../../prisma-config";
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
      where: { id: userId }, // ✅ string ObjectId
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
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true, // ✅ fixed
        updated_at: true, // ✅ fixed
      },
    });

    res.json({ result: users });
  } catch (error) {
    console.error(error);
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
      where: { id }, // ✅ string
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User fetched",
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
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    res.status(201).json({
      message: "User created",
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
      where: { id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    res.json({
      message: "User updated",
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
      where: { id },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// STAFF DASHBOARD
// -------------------------
export const getStaffDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json({
    message: "Welcome to the STAFF dashboard",
    user: req.user,
  });
};
