module.exports = app => {
  // List of available Routes
  app.use("/auth", require("./Auth"));
  app.use("/users", require("./Users"));
  app.use("/mailer", require("./Mailer"));
};
