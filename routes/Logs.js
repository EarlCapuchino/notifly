const router = require("express").Router(),
  { browse, find, user } = require("../controllers/Logs"),
  { protect } = require("../middleware");

router
  .get("/browse", protect, browse)
  .get("/find", protect, find)
  .get("/user", protect, user);

module.exports = router;
