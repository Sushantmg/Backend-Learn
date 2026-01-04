import { Router, Request, Response, NextFunction } from "express";
import {
  getAllProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} from "./handler";

import { validateToken, allowRoles } from "../../middleware/authMiddleware";
import { upload } from "../../middleware/upload";

const router = Router();

// Logger middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  validateToken,
  allowRoles("STAFF", "SUPERUSER"),
  upload.single("image"),
  postProduct
);

router.put(
  "/:id",
  validateToken,
  allowRoles("SUPERUSER"),
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  validateToken,
  allowRoles("SUPERUSER"),
  deleteProduct
);

export default router;
