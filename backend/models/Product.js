const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    product_name: String,
    cost: Number,
    min_quantity: Number,
    stock: Number,
    unit: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
