const router = require("express").Router(),
  { messages, tagging, liking, sharing } = require("../controllers/Selenium"),
  { protect } = require("../middleware");

router
  .post("/messaging", protect, messages)
  .post("/tagging", protect, tagging)
  .post("/liking", protect, liking)
  .post("/sharing", protect, sharing);

module.exports = router;
