const router = require("express").Router(),
  {
    login,
    // validateRefresh,
    save,
    changePassword,
    file,
  } = require("../../controllers/Persons/Auth"),
  { protect } = require("../../middleware");

router
  .get("/login", login)
  // .get("/validateRefresh", protect, validateRefresh)
  .post("/save", save)
  .put("/changePassword", protect, changePassword)
  .post("/file", protect, file);

module.exports = router;
