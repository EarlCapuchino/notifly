const Entity = require("../models/Logs");

exports.browse = (req, res) =>
  Entity.find()
    .populate({
      path: "user",
      select: "fullName role email",
    })
    .select("-updatedAt -__v")
    .sort({ createdAt: -1 })
    .lean()
    .then(logs => res.json(logs))
    .catch(error => res.status(400).json({ error: error.message }));

exports.find = (req, res) =>
  Entity.find()
    .byModel(req.query.model)
    .populate({
      path: "user",
      select: "fullName role email",
    })
    .select("-updatedAt -__v")
    .then(logs => res.json(logs))
    .catch(error => res.status(400).json({ error: error.message }));

exports.user = (req, res) =>
  Entity.find()
    .byUser(req.query.id)
    .select("-updatedAt -__v -user")
    .then(logs => res.json(logs))
    .catch(error => res.status(400).json({ error: error.message }));
