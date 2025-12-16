import { Request, Response } from "express";
import prisma from "../../prisma-config";

// -------------------------
// GET ALL PRODUCTS
// -------------------------
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// GET PRODUCT BY ID
// -------------------------
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }, // ✅ MongoDB ObjectId is STRING
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// CREATE PRODUCT
// -------------------------
export const postProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, rating } = req.body;

    if (!title || !description || price === undefined || rating === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingProduct = await prisma.product.findFirst({
      where: { title }, // ✅ findFirst (title is NOT unique)
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product title already exists" });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        rating: Number(rating),
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error in postProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// UPDATE PRODUCT
// -------------------------
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, rating } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: title ?? product.title,
        description: description ?? product.description,
        price: price !== undefined ? Number(price) : product.price,
        rating: rating !== undefined ? Number(rating) : product.rating,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// -------------------------
// DELETE PRODUCT
// -------------------------
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
