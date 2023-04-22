module.exports = app => {
  // List of available Routes
  app.use("/clusters", require("./Clusters"));
  app.use("/posts", require("./Posts"));
  app.use("/pages", require("./Pages"));
  app.use("/groupchats", require("./GroupChats"));
  app.use("/meetings", require("./Meetings"));
};
