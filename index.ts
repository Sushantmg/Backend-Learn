import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { upload } from "./middleware/upload";

// Routes
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";

const app: Application = express();
const port = 3005;

// --------------------
// Middlewares
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
} else {
  console.log("✅ uploads folder already exists");
}

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
app.post("/file-example", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    // ✅ Save file to uploads/
    fs.writeFileSync(filePath, req.file.buffer);

    return res.json({
      message: "File uploaded successfully",
      filename,
      url: `http://localhost:${port}/uploads/${filename}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// Home route
// --------------------
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API Server running! Use /users or /products");
});

// --------------------
// Server start
// --------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
