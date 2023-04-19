const router = require("express").Router(),
  { messages, tagging, liking } = require("../controllers/Selenium"),
  { protect } = require("../middleware");

router
  .post("/messaging", protect, messages)
  .post("/tagging", protect, tagging)
  .post("/liking", protect, liking);

module.exports = router;
