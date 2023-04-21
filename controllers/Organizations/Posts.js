const Posts = require("../../models/Organizations/Posts"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>posts/browse");

  Posts.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(posts => {
      console.log(">>posts/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: posts,
      });
    })
    .catch(error => {
      console.log(">>posts/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>posts/save");

  Posts.create(req.body)
    .then(post => {
      console.log(">>posts/save - create success");
      res.status(201).json({
        status: true,
        message: `(${post._id}) Created Successfully`,
        content: post,
      });
    })
    .catch(error => {
      console.log(">>posts/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>posts/archive");

  Posts.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(posts => {
      console.log(">>posts/archive - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: posts,
      });
    })
    .catch(error => {
      console.log(">>posts/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>posts/update");

  Posts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(post => {
      console.log(">>posts/update - update success");
      res.json({
        status: true,
        message: `(${post._id}) Updated Successfully`,
        content: post,
      });
    })
    .catch(error => {
      console.log(">>posts/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>posts/restore");

  Posts.findById(req.params.id).then(post => {
    if (post && !post.isActive) {
      console.log(">>posts/restore - item found");

      Posts.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "posts",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>posts/restore - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>posts/restore - item not found/already restored");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>posts/destroy");

  Posts.findById(req.params.id).then(post => {
    if (post && post.isActive) {
      console.log(">>posts/destroy - item found");
      Posts.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "posts",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>posts/destroy - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>posts/destroy - item not found/already deleted");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
