const Subscription = require("../models/Subscription");

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      vendor: req.vendor.id,
    }).populate("plan");
    if (!subscription) {
      return res.json({ active: false });
    }
    const today = new Date();
    const active = today <= subscription.end_date;

    res.json({ active, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
