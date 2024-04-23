module.exports = app => {
  // List of available Routes
  app.use("/auth", require("./Auth"));
  app.use("/members", require("./Members"));
  app.use("/mailer", require("./Mailer"));
};
