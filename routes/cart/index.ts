const express = require("express");
const router = express.Router();

const { getAllCarts, addToCart, removeFromCart, clearCart } = require("./handler");
const { validateToken } = require("../../middleware/authMiddleware");


router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


router.get("/", validateToken, getAllCarts);
router.post("/add", validateToken, addToCart);
router.post("/remove", validateToken, removeFromCart); 
router.delete("/clear", validateToken, clearCart);   

module.exports = router;
