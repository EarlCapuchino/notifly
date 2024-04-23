const GroupChats = require("../../models/Organizations/GroupChats"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>groupchats/browse");

  GroupChats.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(groupchats => {
      console.log(">>groupchats/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: groupchats,
      });
    })
    .catch(error => {
      console.log(">>groupchats/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>groupchats/save");

  GroupChats.create(req.body)
    .then(groupchat => {
      console.log(">>groupchats/save - create success");
      res.status(201).json({
        status: true,
        message: `(${groupchat._id}) Created Successfully`,
        content: groupchat,
      });
    })
    .catch(error => {
      console.log(">>groupchats/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>groupchats/archive");

  GroupChats.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(groupchats => {
      console.log(">>groupchats/archive - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: groupchats,
      });
    })
    .catch(error => {
      console.log(">>groupchats/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>groupchats/update");

  GroupChats.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(groupchat => {
      console.log(">>groupchats/update - update success");
      res.json({
        status: true,
        message: `(${groupchat._id}) Updated Successfully`,
        content: groupchat,
      });
    })
    .catch(error => {
      console.log(">>groupchats/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>groupchats/restore");

  GroupChats.findById(req.params.id).then(groupchat => {
    if (groupchat && !groupchat.isActive) {
      console.log(">>groupchats/restore - item found");

      GroupChats.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "groupchats",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>groupchats/restore - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>groupchats/restore - item not found/already restored");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>groupchats/destroy");

  GroupChats.findById(req.params.id).then(groupchat => {
    if (groupchat && groupchat.isActive) {
      console.log(">>groupchats/destroy - item found");
      GroupChats.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "groupchats",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>groupchats/destroy - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>groupchats/destroy - item not found/already deleted");

      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
