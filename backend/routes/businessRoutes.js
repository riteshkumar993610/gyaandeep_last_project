const express = require("express");
const {
  setBusiness,
  getBusiness,
} = require("../controllers/businessController");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/", auth, setBusiness);
router.get("/", auth, getBusiness);

module.exports = router;
