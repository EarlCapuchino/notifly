const router = require("express").Router(),
  { messages, tagging } = require("../../controllers/Selenium"),
  { protect } = require("../../middleware");

router.post("/messaging", protect, messages).post("/tagging", protect, tagging);

module.exports = router;
