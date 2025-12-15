import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// -------------------------
// GET ALL CART ITEMS
// -------------------------
export const getAllCarts = async (req, res) => {
  try {
    const user_id = req.user_id; // string ObjectId
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
export const addToCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user_id;

    if (!product_id) return res.status(400).json({ error: "Product ID required" });

    const productExists = await prisma.product.findUnique({
      where: { id: product_id }, // string ObjectId
    });
    if (!productExists) return res.status(400).json({ error: "Product does not exist" });

    const existingCart = await prisma.userCart.findUnique({
      where: { user_id_product_id: { user_id, product_id } },
    });

    if (existingCart) {
      const updatedCart = await prisma.userCart.update({
        where: { user_id_product_id: { user_id, product_id } },
        data: { count: existingCart.count + 1 },
      });
      return res.json({ message: "Cart updated", data: updatedCart });
    }

    const newCart = await prisma.userCart.create({
      data: { user_id, product_id, count: 1 },
    });
    res.json({ message: "Product added to cart", data: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// REMOVE FROM CART
// -------------------------
export const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user_id;

    if (!product_id) return res.status(400).json({ error: "Product ID required" });

    const existingCart = await prisma.userCart.findUnique({
      where: { user_id_product_id: { user_id, product_id } },
    });
    if (!existingCart) return res.status(400).json({ error: "Product not in cart" });

    if (existingCart.count > 1) {
      const updatedCart = await prisma.userCart.update({
        where: { user_id_product_id: { user_id, product_id } },
        data: { count: existingCart.count - 1 },
      });
      return res.json({ message: "Cart updated", data: updatedCart });
    }

    await prisma.userCart.delete({
      where: { user_id_product_id: { user_id, product_id } },
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
export const clearCart = async (req, res) => {
  try {
    const user_id = req.user_id;
    await prisma.userCart.deleteMany({ where: { user_id } });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
