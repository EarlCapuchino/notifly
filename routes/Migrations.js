const router = require("express").Router(),
  { save } = require("../controllers/Migrations"),
  { protect } = require("../middleware");

router.post("/save", save);

module.exports = router;
