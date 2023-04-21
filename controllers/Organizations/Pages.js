const Pages = require("../../models/Organizations/Pages"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>pages/browse");

  Pages.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(pages => {
      console.log(">>pages/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: pages,
      });
    })
    .catch(error => {
      console.log(">>pages/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>pages/save");

  Pages.create(req.body)
    .then(page => {
      console.log(">>pages/save - create success");
      res.status(201).json({
        status: true,
        message: `(${page._id}) Created Successfully`,
        content: page,
      });
    })
    .catch(error => {
      console.log(">>pages/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>pages/archive");

  Pages.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(pages => {
      console.log(">>pages/archive - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: pages,
      });
    })
    .catch(error => {
      console.log(">>pages/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>pages/update");

  Pages.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(page => {
      console.log(">>pages/update - update success");
      res.json({
        status: true,
        message: `(${page._id}) Updated Successfully`,
        content: page,
      });
    })
    .catch(error => {
      console.log(">>pages/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>pages/restore");

  Pages.findById(req.params.id).then(page => {
    if (page && !page.isActive) {
      console.log(">>pages/restore - item found");

      Pages.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "pages",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>pages/restore - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>pages/restore - item not found/already restored");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>pages/destroy");

  Pages.findById(req.params.id).then(page => {
    if (page && page.isActive) {
      console.log(">>pages/destroy - item found");
      Pages.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "pages",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>pages/destroy - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>pages/destroy - item not found/already deleted");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
