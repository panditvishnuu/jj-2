const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

async function uploadToCloudinary(files) {
  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (err, result) =>
              err ? reject(err) : resolve(result.secure_url)
            )
            .end(file.buffer);
        })
    )
  );
}

// // Upload all files to Cloudinary, return array of URLs
// const uploadToCloudinary = async (files) => {
//   const uploads = files.map(
//     (file) =>
//       new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ resource_type: "auto" }, (err, result) => {
//             if (err) reject(err);
//             else resolve(result.secure_url);
//           })
//           .end(file.buffer);
//       })
//   );
//   return Promise.all(uploads);
// };

exports.createProduct = async (req, res) => {
  try {
    // upload and pick primary
    const urls = await uploadToCloudinary(req.files);
    const primaryImage = urls[0];

    // assemble product data
    const productData = {
      image: primaryImage,
      images: urls,
      tag: req.body.tag,
      name: req.body.name,
      price: req.body.price ? Number(req.body.price) : null,
      currency: req.body.currency,
      taxInfo: req.body.taxInfo,
      description: req.body.description,
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : req.body.sizes.split(",").map((s) => s.trim()),
      styleCode: req.body.styleCode || null,
      setIncludes: req.body.setIncludes,
      fabric:
        typeof req.body.fabric === "string"
          ? JSON.parse(req.body.fabric)
          : req.body.fabric,
      color: req.body.color,
      washCare: req.body.washCare,
      modelSize: req.body.modelSize || null,
      disclaimer: req.body.disclaimer,
    };

    // **use .save() instead of .create()** to trigger pre("save")
    const product = new Product(productData);
    await product.save();

    return res.status(201).json(product);
  } catch (err) {
    console.error("Creation error:", err);
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors || err.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    // Map into your exact sample shape
    const formatted = products.map((p) => ({
      id: p.id,
      image: p.image,
      tag: p.tag,
      name: p.name,
      price: p.price,
      currency: p.currency,
      taxInfo: p.taxInfo,
      description: p.description,
      sizes: p.sizes,
      styleCode: p.styleCode,
      setIncludes: p.setIncludes,
      fabric: p.fabric,
      color: p.color,
      washCare: p.washCare,
      modelSize: p.modelSize,
      disclaimer: p.disclaimer,
      images: p.images,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findOneAndDelete({ id: req.params.id });
    if (!prod) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
