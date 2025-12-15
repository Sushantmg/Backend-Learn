import { Router, Request, Response, NextFunction } from "express";
import {
  getAllProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} from "./handler";

import { validateToken, allowRoles } from "../../middleware/authMiddleware";

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
  postProduct
);

router.put(
  "/:id",
  validateToken,
  allowRoles("SUPERUSER"),
  updateProduct
);

router.delete(
  "/:id",
  validateToken,
  allowRoles("SUPERUSER"),
  deleteProduct
);

export default router;
