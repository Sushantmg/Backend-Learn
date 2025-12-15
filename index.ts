const express = require("express");
const app = express();
const port = 3005;
const cors = require("cors");
import multer from "multer";

const upload =  multer ({
  storage : multer.memoryStorage(),
})
 


app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const cart = require("./routes/cart");

app.use("/cart", cart);

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.post("/file-example",(req,res) =>{
  try{
    console.log(req.body);
    res.json("OK");
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json("error");
  }
}
);
app.get("/", (req, res) => {
  res.send("🚀 API Server running! Use /users or /products");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
