const { saveProduct, getProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, saveProduct);
router.get("/", auth, getProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
