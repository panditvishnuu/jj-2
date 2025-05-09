// routes/product.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../controllers/productController");
const { uploadImages } = require("../middleware/upload");

router.post("/", uploadImages, createProduct);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);

module.exports = router;
