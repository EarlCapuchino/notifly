const Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Members.find()
    .byActive(true)
    .select("-password -createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

exports.archive = (req, res) =>
  Members.find()
    .byActive(false)
    .select("-password -createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Members.findById(req.query.id)
    .select("-password -deletedAt -createdAt -updatedAt -__v")
    .then(user => res.json(user))
    .catch(error => res.status(400).json({ error: error.message }));

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

exports.restore = (req, res) =>
  Members.findById(req.query.id).then(user => {
    if (!user.isActive) {
      User.findByIdAndUpdate(req.query.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "users",
          itemId: req.query.id,
          action: "restore",
          user: res.locals.user._id,
        }).then(() => res.json(req.query.id))
      );
    } else {
      res.status(400).json(`(${req.query.id}) is already Active`);
    }
  });

exports.destroy = (req, res) =>
  Members.findById(req.query.id).then(user => {
    if (user.isActive) {
      Members.findByIdAndUpdate(req.query.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "users",
          itemId: req.query.id,
          action: "archive",
          user: res.locals.user._id,
        }).then(() => res.json(req.query.id))
      );
    } else {
      res.status(400).json(`(${req.query.id}) is already Inactive`);
    }
  });
