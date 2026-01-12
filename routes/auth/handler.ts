import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();
import { generateOtp } from "../../utils/otp";
import { getTransporter } from "../../utils/mailService";
import { welcomeEmailTemplate } from "../../templates/welcome";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET as string;
const loginLink = "http://localhost:3000/login";

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email/Password does not match" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email/Password does not match" });
    }

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
    console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * USER REGISTER
 */
export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

 const now = new Date();
now.setMinutes(now.getMinutes() + 10);
const otp = generateOtp();
const newUser = await prisma.tempUser.create({
  data: {
    name,
    email,
    password: hashedPassword,
    otp,
    expiry: now,
  },
});


    // Send welcome email
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"My App Team" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: "Welcome to My App!",
      text: `Hello ${newUser.name}, welcome to My App! 🎉`,
      html: welcomeEmailTemplate(newUser.name, loginLink),
    });

    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));

    res.status(201).json({
      result: "Registration Successful",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

/**
 * STAFF REGISTER (SUPERUSER ONLY)
 */
export const staffRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Staff with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF",
      },
    });

    // Send welcome email to staff
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"My App Team" <${process.env.EMAIL_USER}>`,
      to: newStaff.email,
      subject: "Welcome to My App as Staff!",
      text: `Hello ${newStaff.name}, welcome to My App as staff! 🎉`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome Email</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
          h1 { color: #333; }
          p { color: #555; line-height: 1.5; }
          .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to My App as Staff!</h1>
          <p>Hello <strong>${newStaff.name}</strong>,</p>
          <p>Thank you for joining our team. We are excited to have you onboard! 🎉</p>
          <p>Login and start managing your tasks.</p>
          <a href="http://localhost:3000/login" class="button">Login Now</a>
          <div class="footer">
            &copy; 2026 My App. All rights reserved.
          </div>
        </div>
      </body>
      </html>
      `,
    });

    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));

    res.status(201).json({
      result: "Staff Registration Successful",
      user: newStaff,
    });
  } catch (error: any) {
    console.error("Staff registration error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

/**
 * GET ME
 */
export const getMe = async (
  req: Request & { user_id?: string },
  res: Response
) => {
  try {
    const id = req.user_id;

    if (!id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * CHANGE PASSWORD
 */
export const changePassword = async (
  req: Request & { user_id?: string },
  res: Response
) => {
  try {
    const id = req.user_id;
    const { oldPassword, newPassword } = req.body;

    if (!id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "Your old password does not match" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new password cannot be the same" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: String(id) },
      data: { password: hashedNewPassword },
    });

    res.json({ result: "Password successfully changed" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
