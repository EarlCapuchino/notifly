const router = require("express").Router(),
  { sendCode } = require("../../controllers/Persons/Mailer"),
  { protect } = require("../../middleware");

router.post("/code", protect, sendCode);

module.exports = router;
