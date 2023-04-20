const router = require("express").Router(),
  { announce } = require("../../controllers/Persons/Mailer"),
  { protect } = require("../../middleware");

router.post("/announce", protect, announce);

module.exports = router;
