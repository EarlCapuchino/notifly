const Clusters = require("../../models/Organizations/Clusters"),
  Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Clusters.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(clusters =>
      Members.find()
        .byActive(true)
        .populate("clusters")
        .lean()
        .then(members => {
          const newClusters = clusters.map(cluster => {
            const _cluster = { ...cluster, isSelected: false, members: [] };

            members?.map(member => {
              if (member.clusters.length > 0) {
                member.clusters?.map(_clstr => {
                  if (cluster.name === _clstr.name) {
                    const _member = { ...member };
                    _member.clusters = undefined;
                    _cluster.members.push(_member);
                  }
                });
              }
            });

            return _cluster;
          });

          res.json({
            status: true,
            message: "Fetched Successfully",
            content: newClusters,
          });
        })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.save = (req, res) =>
  Clusters.create(req.body)
    .then(cluster =>
      res.status(201).json({
        status: true,
        message: `(${cluster._id}) Created Successfully`,
        content: cluster,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.archive = (req, res) =>
  Clusters.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(clusters =>
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: clusters,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.update = (req, res) =>
  Clusters.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(cluster =>
      res.json({
        status: true,
        message: `(${cluster._id}) Updated Successfully`,
        content: cluster,
      })
    )
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );

exports.restore = (req, res) =>
  Clusters.findById(req.params.id).then(cluster => {
    if (cluster && !cluster.isActive) {
      Clusters.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "clusters",
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
  Clusters.findById(req.params.id).then(cluster => {
    if (cluster && cluster.isActive) {
      Clusters.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "clusters",
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
