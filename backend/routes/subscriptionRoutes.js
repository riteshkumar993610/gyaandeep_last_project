const { getSubscription } = require("../controllers/subscriptionController");
const auth = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router.get("/", auth, getSubscription);

module.exports = router;
