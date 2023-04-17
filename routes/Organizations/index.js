module.exports = app => {
  // List of available Routes
  app.use("/clusters", require("./Clusters"));
};
