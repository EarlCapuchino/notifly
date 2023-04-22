const FBGroups = require("../../models/Organizations/FBGroups"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>fbgroups/browse");

  FBGroups.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(fbgroups => {
      console.log(">>fbgroups/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: fbgroups,
      });
    })
    .catch(error => {
      console.log(">>fbgroups/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>fbgroups/save");

  FBGroups.create(req.body)
    .then(fbgroup => {
      console.log(">>fbgroups/save - create success");
      res.status(201).json({
        status: true,
        message: `(${fbgroup._id}) Created Successfully`,
        content: fbgroup,
      });
    })
    .catch(error => {
      console.log(">>fbgroups/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>fbgroups/archive");

  FBGroups.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(fbgroups => {
      console.log(">>fbgroups/archive - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: fbgroups,
      });
    })
    .catch(error => {
      console.log(">>fbgroups/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>fbgroups/update");

  FBGroups.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(fbgroup => {
      console.log(">>fbgroups/update - update success");
      res.json({
        status: true,
        message: `(${fbgroup._id}) Updated Successfully`,
        content: fbgroup,
      });
    })
    .catch(error => {
      console.log(">>fbgroups/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>fbgroups/restore");

  FBGroups.findById(req.params.id).then(fbgroup => {
    if (fbgroup && !fbgroup.isActive) {
      console.log(">>fbgroups/restore - item found");

      FBGroups.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "fbgroups",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>fbgroups/restore - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>fbgroups/restore - item not found/already restored");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>fbgroups/destroy");

  FBGroups.findById(req.params.id).then(fbgroup => {
    if (fbgroup && fbgroup.isActive) {
      console.log(">>fbgroups/destroy - item found");
      FBGroups.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "fbgroups",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>fbgroups/destroy - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>fbgroups/destroy - item not found/already deleted");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
