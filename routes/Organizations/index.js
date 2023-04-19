module.exports = app => {
  // List of available Routes
  app.use("/clusters", require("./Clusters"));
  app.use("/posts", require("./Posts"));
  app.use("/meetings", require("./Meetings"));
};
