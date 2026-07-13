const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: String,
    mobile: String,
    address: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Customer", customerSchema);
