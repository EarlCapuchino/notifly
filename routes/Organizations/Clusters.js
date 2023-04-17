const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    restore,
    archive,
  } = require("../../controllers/Organizations/Clusters"),
  { protect } = require("../../middleware");

router
  .get("/", browse)
  .get("/archive", protect, archive)
  .post("/save", protect, save)
  .put("/:id/update", protect, update)
  .put("/:id/restore", protect, restore)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
