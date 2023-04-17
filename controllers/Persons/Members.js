const Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Members.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(members =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: members,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.archive = (req, res) =>
  Members.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(members =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: members,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.save = (req, res) =>
  Members.create(req.body)
    .then(member =>
      res.status(201).json({
        status: true,
        message: `(${member._id}) Created Successfully`,
        content: member,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.update = (req, res) => {
  Members.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(user =>
      res.json({
        status: true,
        message: `(${user._id}) Updated Successfully`,
        content: user,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );
};

exports.destroy = (req, res) =>
  Members.findById(req.params.id).then(member => {
    if (member.isActive) {
      Members.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "members",
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

exports.restore = (req, res) =>
  Members.findById(req.params.id).then(member => {
    if (!member.isActive) {
      Members.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "members",
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
