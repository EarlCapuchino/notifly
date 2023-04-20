const Pages = require("../../models/Organizations/Pages"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Pages.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(pages =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: pages,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.save = (req, res) =>
  Pages.create(req.body)
    .then(page =>
      res.status(201).json({
        status: true,
        message: `(${page._id}) Created Successfully`,
        content: page,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.archive = (req, res) =>
  Pages.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(pages =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: pages,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.update = (req, res) =>
  Pages.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(page =>
      res.json({
        status: true,
        message: `(${page._id}) Updated Successfully`,
        content: page,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.restore = (req, res) =>
  Pages.findById(req.params.id).then(page => {
    if (page && !page.isActive) {
      Pages.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "pages",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() =>
          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          })
        )
      );
    } else {
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });

exports.destroy = (req, res) =>
  Pages.findById(req.params.id).then(page => {
    if (page && page.isActive) {
      Pages.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "pages",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() =>
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          })
        )
      );
    } else {
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
