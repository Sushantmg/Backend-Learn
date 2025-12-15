import express from "express";
import {
  getAllCarts,
  addToCart,
  removeFromCart,
  clearCart,
} from "./handler";
import { validateToken } from "../../middleware/authMiddleware";

const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Cart routes
router.get("/", validateToken, getAllCarts);
router.post("/add", validateToken, addToCart);
router.post("/remove", validateToken, removeFromCart);
router.delete("/clear", validateToken, clearCart);

export default router;
