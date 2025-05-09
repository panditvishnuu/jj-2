// routes/product.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../controllers/productController");
const { uploadImages } = require("../middleware/upload");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

router.post("/", authenticate, authorize("owner"), uploadImages, createProduct);
router.get("/", authenticate, getAllProducts);
router.delete("/:id", authenticate, authorize("owner"), deleteProduct);

module.exports = router;
