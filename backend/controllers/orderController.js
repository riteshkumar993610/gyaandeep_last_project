const Order = require("../models/Order");
const Custumer = require("../models/Customer");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

exports.createOrder = async (req, res) => {
  try {
    const { customer, items } = req.body;
    let savedCustomer = await Customer.findOne({
      vendor: req.vendor.id,
      mobile: customer.mobile,
    });
    if (!savedCustomer) {
      savedCustomer = await Customer.create({
        vendor: req.vendor.id,
        ...customer,
      });
    }

    let orderItems = [];
    let totalQuantity = 0;
    let totalPricing = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.product,
        vendor: req.vendor.id,
      });
      if (!product) continue;

      const pricing = product.cost * item.quantity;

      orderItems.push({
        product: product._id,
        product_name: product.product_name,
        quantity: item.quantity,
        rate: product.cost,
        pricing,
      });
      totalQuantity += item.quantity;
      totalPricing += pricing;
    }
    const order = await Order.create({
      vendor: req.vendor.id,
      customer: savedCustomer._id,
      order_items: orderItems,
      total_quantity: totalQuantity,
      total_pricing: totalPricing,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.vendor.id })
      .populate("customer")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
