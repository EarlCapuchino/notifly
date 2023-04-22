const router = require("express").Router(),
  {
    messages,
    tagging,
    liking,
    sharing,
    posting,
    taggingMultiple,
  } = require("../controllers/Selenium"),
  { protect } = require("../middleware");

router
  .post("/messaging", protect, messages)
  .post("/tagging", protect, tagging)
  .post("/tagging/multiple", protect, taggingMultiple)
  .post("/liking", protect, liking)
  .post("/posting", protect, posting)
  .post("/sharing", protect, sharing);

module.exports = router;
