const Product = require("../models/Product");

exports.saveProduct = async (req, res) => {
  try {
    const product = await Product.create({
      vendor: req.vendor.id,
      ...req.body,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.vendor.id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id, vendor: req.vendor.id });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
