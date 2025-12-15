import { Request, Response } from "express";
import prisma from "../../prisma-config";
import { productSchema } from "../../schemas/product.schema"; // adjust path if needed

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
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

export const postProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = productSchema.parse(req.body);

    const { title, description, price, rating } = validatedData;

    const existingProduct = await prisma.product.findUnique({
      where: { title },
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
  } catch (error: any) {
    console.error("Error in postProduct:", error);

    if (error?.errors) {
      return res.status(400).json({
        errors: error.errors,
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price, rating } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: title ?? product.title,
        description: description ?? product.description,
        price: price ? Number(price) : product.price,
        rating: rating ? Number(rating) : product.rating,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
