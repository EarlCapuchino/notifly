const router = require("express").Router(),
  {
    login,
    // validateRefresh,
  } = require("../../controllers/Persons/Auth");

router.get("/login", login);
// .get("/validateRefresh", protect, validateRefresh)

module.exports = router;
