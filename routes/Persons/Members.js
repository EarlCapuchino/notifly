const router = require("express").Router(),
  {
    browse,
    update,
    save,
    destroy,
    archive,
    cluster,
    restore,
  } = require("../../controllers/Persons/Members"),
  { protect } = require("../../middleware");

router
  .get("/", protect, browse)
  .get("/cluster", protect, cluster)
  .get("/archive", protect, archive)
  .post("/save", protect, save)
  .put("/:id/update", protect, update)
  .put("/:id/restore", protect, restore)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
