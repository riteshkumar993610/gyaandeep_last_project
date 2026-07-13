const Business = require("../models/BusinessInfo");

const setBusiness = async (req, res) => {
  try {
    const data = await Business.findOneAndUpdate(
      { vendor: req.vendor.id },
      {
        vendor: req.vendor.id,
        ...req.body,
      },
      {
        new: true,
        upsert: true,
      },
    );
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to Set Business", error: err.message });
  }
};

const getBusiness = async (req, res) => {
  const data = await Business.findOne({ vendor: req.vendor.id });
  res.json(data);
};

module.exports = { setBusiness, getBusiness };
