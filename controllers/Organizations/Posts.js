const Posts = require("../../models/Organizations/Posts"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Posts.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(posts =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: posts,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.save = (req, res) =>
  Posts.create(req.body)
    .then(post =>
      res.status(201).json({
        status: true,
        message: `(${post._id}) Created Successfully`,
        content: post,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.archive = (req, res) =>
  Posts.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(posts =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: posts,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.update = (req, res) =>
  Posts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(post =>
      res.json({
        status: true,
        message: `(${post._id}) Updated Successfully`,
        content: post,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.restore = (req, res) =>
  Posts.findById(req.params.id).then(post => {
    if (!post.isActive) {
      Posts.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "posts",
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
  Posts.findById(req.params.id).then(post => {
    if (post.isActive) {
      Posts.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "posts",
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
