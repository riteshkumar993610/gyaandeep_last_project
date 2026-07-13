const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token Not Found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.vendor = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
      error: err.message,
    });
  }
};

module.exports = auth;
