import express, { Application, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { upload } from "./middleware/upload";
import fs from "fs";
import path from "path";


// Routes
import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import { UploadRequest } from "./types/global-types";

const app: Application = express();
const port = 3005;



// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.post("/file-example", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(req.file);

    return res.json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});
const uploadFolder = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log("📁 uploads folder created");
} else {
  console.log("✅ uploads folder already exists");
}



app.use("/uploads", express.static(uploadFolder));
// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API Server running! Use /users or /products");
});

// Server start
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
