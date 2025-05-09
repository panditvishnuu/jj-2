// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  image: String,
  images: [String],
  tag: String,
  name: String,
  price: { type: Number, min: [0, "Price must be positive"] },
  currency: { type: String, default: "INR" },
  taxInfo: String,
  description: String,
  sizes: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "At least one size must be selected",
    },
  },
  styleCode: String,
  setIncludes: String,
  fabric: mongoose.Schema.Types.Mixed,
  color: String,
  washCare: String,
  modelSize: String,
  disclaimer: String,
  createdAt: { type: Date, default: Date.now },
});

// **Move** the hook to `pre("validate")`
productSchema.pre("validate", async function (next) {
  if (this.isNew) {
    // Find the current max and increment
    const last = await this.constructor.findOne().sort({ id: -1 });
    this.id = last ? last.id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
