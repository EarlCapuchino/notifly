const Meetings = require("../../models/Organizations/Meetings"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Meetings.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(meetings =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: meetings,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.save = (req, res) =>
  Meetings.create(req.body)
    .then(meeting =>
      res.status(201).json({
        status: true,
        message: `(${meeting._id}) Created Successfully`,
        content: meeting,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.archive = (req, res) =>
  Meetings.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(meetings =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: meetings,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.update = (req, res) =>
  Meetings.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(meeting =>
      res.json({
        status: true,
        message: `(${meeting._id}) Updated Successfully`,
        content: meeting,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.restore = (req, res) =>
  Meetings.findById(req.params.id).then(meeting => {
    if (meeting && !meeting.isActive) {
      Meetings.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "meetings",
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
  Meetings.findById(req.params.id).then(meeting => {
    if (meeting && meeting.isActive) {
      Meetings.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "meetings",
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
