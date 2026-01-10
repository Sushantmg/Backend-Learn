import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import { upload } from "./middleware/upload";
import { fileUpload } from "./utils/fileService";

import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import nodemailer from "nodemailer";


import db from "./db";
import { transporter } from "./utils/mailService";

const app: Application = express();
const port = 3005;

// --------------------
// Global Middlewares
// --------------------
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --------------------
// Uploads folder setup
// --------------------
const uploadFolder = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log("📁 uploads folder created");
}

// Serve uploaded files
app.use("/uploads", express.static(uploadFolder));

// --------------------
// Routes
// --------------------
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/uploads", express.static("uploads/products/"));
// --------------------
// File Upload Route
// --------------------
// app.post(
//   "/file-example",
//   upload.single("image"),
//   async (req: Request, res: Response) => {
//     try {
//       const file = req.file;

//       if (!file) {
//         return res.status(400).json({
//           message: "No file uploaded",
//         });
//       }

//       // ✅ use utility function
//       const uploadedFile = await fileUpload(file);

//       // Save file path in DB
//       const savedFile = await db.fileUpload.create({
//         data: {
//           file: uploadedFile.path,
//         },
//       });

//       return res.status(201).json({
//         message: "File uploaded successfully",
//         data: savedFile,
//         url: `http://localhost:${port}/${uploadedFile.path}`,
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         message: "File upload failed",
//       });
//     }
//   }
// );
  app.get("/email-example", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: `"Email from SUSHAN" <${process.env.EMAIL_USER}>`,
      to: "sushantamang03@gmail.com",
      subject: "Hello ✔",
      text: "Hello my family", // plain text
      html: "<b>Hello world?</b>", // html
    });

    // send success response
    res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send email",
      error,
    });
  }
});


// --------------------
// Home route
// --------------------
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API Server running!");
});

// --------------------
// Server start
// --------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

console.log("📦 DB Models:", Object.keys(db));
