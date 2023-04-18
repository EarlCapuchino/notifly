const router = require("express").Router(),
  { messages } = require("../../controllers/Selenium"),
  { protect } = require("../../middleware");

router.post("/messaging", protect, messages);

module.exports = router;
