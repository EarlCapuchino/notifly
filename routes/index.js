module.exports = app => {
  // List of available Routes
  require("./Persons")(app);
  app.use("/logs", require("./Logs"));
  app.use("/migrations", require("./Migrations"));
};
