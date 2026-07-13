const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: String,
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
