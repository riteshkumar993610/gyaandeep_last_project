const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    plan_name: String,
    days: Number,
    pricing: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Plan", planSchema);
