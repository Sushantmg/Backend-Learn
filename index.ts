import express, { Application, Request, Response } from "express";
import cors from "cors";
import multer from "multer";

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

// Test file route
app.post("/file-example", upload.single("image"),(req: UploadRequest, res) => {
  try {
    console.log(req.image);
    res.json("OK");
  } catch (error) {
    console.error(error);
    res.status(500).json("error");
  }
});

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API Server running! Use /users or /products");
});

// Server start
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
