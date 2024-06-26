const jwt = require("jsonwebtoken"),
  Members = require("../models/Persons/Members");

exports.protect = (req, res, proceed) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      status: false,
      message: "Not authorized, no token",
    });
  } else {
    if (token.startsWith("Bearer")) {
      // decode token
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (error, response) => {
          if (error && error.name) {
            res.status(401).json({
              status: false,
              expired: "Not authorized, token expired",
            });
          } else {
            const user = await Members.findById(response.id).select(
              "-createdAt -updatedAt -__v -password"
            );
            if (user) {
              res.locals.user = user;
              res.locals.email = response.email;
              res.locals.password = response.password;
              proceed();
            } else {
              res.status(401).json({
                status: false,
                expired: "Not authorized, invalid credentials",
              });
            }
          }
        }
      );
    } else {
      res
        .status(401)
        .json({ status: false, error: "Not authorized, invalid token" });
    }
  }
};

exports.notFound = (req, res, proceed) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(400);
  proceed(error);
};

exports.errorHandler = (err, req, res, proceed) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
