const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    start_date: Date,
    end_date: Date,
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
