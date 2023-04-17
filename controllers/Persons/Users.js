const User = require("../../models/Persons/Users"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  User.find()
    .byActive(true)
    .select("-password -createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

exports.guests = (req, res) =>
  User.find()
    .byActive(true)
    .byRole("guest")
    .select("-password -createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

exports.archive = (req, res) =>
  User.find()
    .byActive(false)
    .select("-password -createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  User.findById(req.query.id)
    .select("-password -deletedAt -createdAt -updatedAt -__v")
    .then(user => res.json(user))
    .catch(error => res.status(400).json({ error: error.message }));

exports.update = (req, res) => {
  User.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v")
    .then(user => res.json(user))
    .catch(error => res.status(400).json({ error: error.message }));
};

exports.restore = (req, res) =>
  User.findById(req.query.id).then(user => {
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
  User.findById(req.query.id).then(user => {
    if (user.isActive) {
      User.findByIdAndUpdate(req.query.id, {
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
