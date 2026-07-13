const { createOrder, getOrders } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getOrders);

module.exports = router;
