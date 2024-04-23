const Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>members/browse");

  Members.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .populate("clusters")
    .sort({ createdAt: -1 })
    .lean()
    .then(members => {
      console.log(">>members/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: members,
      });
    })
    .catch(error => {
      console.log(">>members/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>members/archive");

  Members.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(members => {
      console.log(">>members/archive - fetch success");

      res.json({
        status: true,
        message: "Fetched Successfully",
        content: members,
      });
    })
    .catch(error => {
      console.log(">>members/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>members/save");

  Members.create(req.body)
    .then(member => {
      console.log(">>members/save - create success");

      res.status(201).json({
        status: true,
        message: `(${member._id}) Created Successfully`,
        content: member,
      });
    })
    .catch(error => {
      console.log(">>members/save - create failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>members/update");

  Members.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    populate: "clusters",
  })
    .select("-createdAt -updatedAt -__v -isActive")
    .then(user => {
      console.log(">>members/update - update success");

      res.json({
        status: true,
        message: `(${user._id}) Updated Successfully`,
        content: user,
      });
    })
    .catch(error => {
      console.log(">>members/update - update failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.destroy = (req, res) => {
  console.log(">>members/destroy");

  Members.findById(req.params.id).then(member => {
    if (member && member.isActive) {
      console.log(">>members/destroy - item found");
      Members.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "members",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>members/destroy - logs created");

          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>members/destroy - item not found/already deleted");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};

exports.restore = (req, res) => {
  console.log(">>members/restore");

  Members.findById(req.params.id).then(member => {
    if (member && !member.isActive) {
      console.log(">>members/restore - item found");

      Members.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "members",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>members/restore - logs created");

          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>members/restore - item not found/already restored");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};
