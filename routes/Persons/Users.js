const router = require("express").Router(),
  {
    browse,
    find,
    update,
    destroy,
    archive,
    restore,
    guests,
  } = require("../../controllers/Persons/Users"),
  { protect } = require("../../middleware");

router
  .get("/browse", protect, browse)
  .get("/archive", protect, archive)
  .get("/guests", protect, guests)
  .get("/find", protect, find)
  .put("/update", protect, update)
  .get("/restore", protect, restore)
  .delete("/destroy", protect, destroy);

module.exports = router;
