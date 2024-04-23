const Meetings = require("../../models/Organizations/Meetings"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>meetings/browse");

  Meetings.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(meetings => {
      console.log(">>meetings/browse - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: meetings,
      });
    })
    .catch(error => {
      console.log(">>meetings/browse - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>meetings/save");

  Meetings.create(req.body)
    .then(meeting => {
      console.log(">>meetings/save - create success");

      res.status(201).json({
        status: true,
        message: `(${meeting._id}) Created Successfully`,
        content: meeting,
      });
    })
    .catch(error => {
      console.log(">>meetings/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>meetings/archive");

  Meetings.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(meetings => {
      console.log(">>meetings/archive - fetch success");

      res.json({
        status: true,
        message: "Fetched Successfully",
        content: meetings,
      });
    })
    .catch(error => {
      console.log(">>meetings/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>meetings/update");

  Meetings.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(meeting => {
      console.log(">>meetings/update - update success");

      res.json({
        status: true,
        message: `(${meeting._id}) Updated Successfully`,
        content: meeting,
      });
    })
    .catch(error => {
      console.log(">>meetings/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>meetings/restore");

  Meetings.findById(req.params.id).then(meeting => {
    if (meeting && !meeting.isActive) {
      console.log(">>meetings/restore - item found");

      Meetings.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "meetings",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>meetings/restore - logs created");

          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>meetings/restore - item not found/already restored");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>meetings/destroy");

  Meetings.findById(req.params.id).then(meeting => {
    if (meeting && meeting.isActive) {
      console.log(">>meetings/destroy - item found");
      Meetings.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "meetings",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>meetings/destroy - logs created");
          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>meetings/destroy - item not found/already deleted");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
