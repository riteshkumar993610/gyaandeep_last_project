const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    business_name: String,
    category: {
      type: String,
      default: "grocery",
    },
    timing: String,
    whatsapp_no: String,
    contact_no: String,
    address: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Business", businessSchema);
