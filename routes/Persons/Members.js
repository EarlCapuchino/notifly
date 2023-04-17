const router = require("express").Router(),
  {
    browse,
    find,
    update,
    destroy,
    archive,
    restore,
  } = require("../../controllers/Persons/Members"),
  { protect } = require("../../middleware");

router
  .get("/browse", protect, browse)
  .get("/archive", protect, archive)
  .get("/find", protect, find)
  .put("/update", protect, update)
  .get("/restore", protect, restore)
  .delete("/destroy", protect, destroy);

module.exports = router;
