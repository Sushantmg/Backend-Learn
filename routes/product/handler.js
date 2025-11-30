const prisma = require("../../prisma-config");
const { productSchema } = require(" ");

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


const postProduct = async (req, res) => {
  try {
    // Validate request body with Zod
    const validatedData = productSchema.parse(req.body);

    const { title, description, price, rating } = validatedData;

    // Check for duplicate title
    const existingProduct = await prisma.product.findUnique({
      where: { title },
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product title already exists" });
    }

    // Create product in DB
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        rating: parseInt(rating),
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error in postProduct:", error);

    // Handle Zod validation errors
    if (error.errors) {
      return res.status(400).json({
        formErrors: error.formErrors?.formErrors || [],
        fieldErrors: error.formErrors?.fieldErrors || {},
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, rating } = req.body;

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: title || product.title,
        description: description || product.description,
        price: price ? parseFloat(price) : product.price,
        rating: rating ? parseInt(rating) : product.rating,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
};
