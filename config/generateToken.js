const jwt = require("jsonwebtoken");

const generateToken = object =>
  jwt.sign(object, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

module.exports = generateToken;
