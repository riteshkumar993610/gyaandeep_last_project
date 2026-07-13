const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Vendor = require("../models/Vendor");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

const getOrCreateTrialSubscription = async (vendorId) => {
  let subscription = await Subscription.findOne({ vendor: vendorId }).populate(
    "plan",
  );

  if (subscription) {
    return subscription;
  }

  let trialPlan = await Plan.findOne({ plan_name: "3 Days Trial" });

  if (!trialPlan) {
    trialPlan = await Plan.create({
      plan_name: "3 Days Trial",
      days: 3,
      pricing: 0,
    });
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + trialPlan.days);

  subscription = await Subscription.create({
    vendor: vendorId,
    plan: trialPlan._id,
    start_date: startDate,
    end_date: endDate,
    status: "active",
  });

  return subscription.populate("plan");
};

const registerVendor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await Vendor.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Email ALready exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({ name, email, password: hashPassword });

    await getOrCreateTrialSubscription(vendor._id);

    res.json({ message: "Vendor Registerd Successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Vendor Registration Failed",
      error: err.message,
    });
  }
};

const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid email Id" });
    }
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    const token = jwt.sign(
      { id: vendor._id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const subscription = await getOrCreateTrialSubscription(vendor._id);

    res.json({
      message: "Login Success",
      token,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to Login", error: err.message });
  }
};

module.exports = { registerVendor, loginVendor };
