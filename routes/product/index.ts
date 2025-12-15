const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} = require("./handler");

const { validateToken ,allowRoles} = require("../../middleware/authMiddleware");

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


router.get("/", getAllProducts);       
router.get("/:id", getProductById);   


router.post("/", validateToken, allowRoles("STAFF","SUPERUSER"), postProduct);
router.put("/:id", validateToken, allowRoles("SUPERUSER"), updateProduct);
router.delete("/:id", validateToken, allowRoles("SUPERUSER"), deleteProduct);

module.exports = router;
