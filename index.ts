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

import db from "./db";

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

// --------------------
// File Upload Route
// --------------------
app.post(
  "/file-example",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      // ✅ use utility function
      const uploadedFile = await fileUpload(file);

      // Save file path in DB
      const savedFile = await db.fileUpload.create({
        data: {
          file: uploadedFile.path,
        },
      });

      return res.status(201).json({
        message: "File uploaded successfully",
        data: savedFile,
        url: `http://localhost:${port}/${uploadedFile.path}`,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "File upload failed",
      });
    }
  }
);

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
