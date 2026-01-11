import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import nodemailer from "nodemailer";

import userRoutes from "./routes/user";
import productRoutes from "./routes/product";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";

import db from "./db";
import { initMailService, getTransporter } from "./utils/mailService";

const app: Application = express();
const port = 3005;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:3005"],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}
app.use("/uploads", express.static(uploadFolder));

app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.get("/email-example", async (req: Request, res: Response) => {
  try {
    const transporter = getTransporter();

    const info = await transporter.sendMail({
      from: `"Test" <test@example.com>`,
      to: "test@example.com",
      subject: "Hello",
      html: "<b>Hello world</b>",
    });

    res.json({
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    res.status(500).json({ error: "Email failed" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API Server running!");
});

async function startServer() {
  await initMailService();

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

startServer();

console.log("📦 DB Models:", Object.keys(db));
