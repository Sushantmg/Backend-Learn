import { Request, Response } from "express";
import prisma from "../../prisma-config";

// -------------------------
// GET ALL CART ITEMS
// -------------------------
export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const carts = await prisma.userCart.findMany({
      where: { user_id },
      include: { product: true },
    });

    res.json({ message: "Cart fetched", data: carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// ADD TO CART
// -------------------------
export const addToCart = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const { product_id } = req.body;

    if (!user_id) return res.status(401).json({ error: "Unauthorized" });
    if (!product_id) return res.status(400).json({ error: "Product ID required" });

    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingCart = await prisma.userCart.findUnique({
      where: {
        user_id_product_id: { user_id, product_id },
      },
    });

    if (existingCart) {
      const updatedCart = await prisma.userCart.update({
        where: {
          user_id_product_id: { user_id, product_id },
        },
        data: { count: existingCart.count + 1 },
      });

      return res.json({ message: "Cart updated", data: updatedCart });
    }

    const newCart = await prisma.userCart.create({
      data: {
        user_id,
        product_id,
        count: 1,
      },
    });

    res.status(201).json({
      message: "Product added to cart",
      data: newCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// REMOVE FROM CART
// -------------------------
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    const { product_id } = req.body;

    if (!user_id) return res.status(401).json({ error: "Unauthorized" });
    if (!product_id) return res.status(400).json({ error: "Product ID required" });

    const cartItem = await prisma.userCart.findUnique({
      where: {
        user_id_product_id: { user_id, product_id },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Product not in cart" });
    }

    if (cartItem.count > 1) {
      const updatedCart = await prisma.userCart.update({
        where: {
          user_id_product_id: { user_id, product_id },
        },
        data: { count: cartItem.count - 1 },
      });

      return res.json({ message: "Cart updated", data: updatedCart });
    }

    await prisma.userCart.delete({
      where: {
        user_id_product_id: { user_id, product_id },
      },
    });

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// CLEAR CART
// -------------------------
export const clearCart = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: "Unauthorized" });

    await prisma.userCart.deleteMany({
      where: { user_id },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
