const Clusters = require("../../models/Organizations/Clusters"),
  Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) => {
  console.log(">>clusters/browse");

  Clusters.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(clusters => {
      console.log(">>clusters/browse - clusters fetch success");
      Members.find()
        .byActive(true)
        .populate("clusters")
        .lean()
        .then(members => {
          console.log(">>clusters/browse - members fetch success");
          const newClusters = clusters.map((cluster, index) => {
            const _cluster = { ...cluster, isSelected: false, members: [] };

            console.log(
              `>>clusters/browse - data manipulation item #${index + 1}`
            );
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
        .catch(error => {
          console.log(">>clusters/browse - members fetch failed");
          res.status(400).json({ status: false, message: error.message });
        });
    })
    .catch(error => {
      console.log(">>clusters/browse - clusters fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.save = (req, res) => {
  console.log(">>clusters/save");

  Clusters.create(req.body)
    .then(cluster => {
      console.log(">>clusters/save - create success");

      res.status(201).json({
        status: true,
        message: `(${cluster._id}) Created Successfully`,
        content: cluster,
      });
    })
    .catch(error => {
      console.log(">>clusters/save - create failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.archive = (req, res) => {
  console.log(">>clusters/archive");

  Clusters.find()
    .byActive(false)
    .select("-createdAt -updatedAt -__v -isActive")
    .sort({ createdAt: -1 })
    .lean()
    .then(clusters => {
      console.log(">>clusters/archive - fetch success");
      res.json({
        status: true,
        message: "Fetched Successfully",
        content: clusters,
      });
    })
    .catch(error => {
      console.log(">>clusters/archive - fetch failed");
      res.status(400).json({ status: false, message: error.message });
    });
};

exports.update = (req, res) => {
  console.log(">>clusters/update");

  Clusters.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .select("-password -createdAt -updatedAt -__v -isActive")
    .then(cluster => {
      console.log(">>clusters/update - update success");

      res.json({
        status: true,
        message: `(${cluster._id}) Updated Successfully`,
        content: cluster,
      });
    })
    .catch(error => {
      console.log(">>clusters/update - update failed");

      res.status(400).json({ status: false, message: error.message });
    });
};

exports.restore = (req, res) => {
  console.log(">>clusters/restore");

  Clusters.findById(req.params.id).then(cluster => {
    if (cluster && !cluster.isActive) {
      console.log(">>clusters/restore - item found");

      Clusters.findByIdAndUpdate(req.params.id, {
        deletedAt: "",
        isActive: true,
      }).then(() =>
        Logs.create({
          model: "clusters",
          itemId: req.params.id,
          action: "restore",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>clusters/restore - logs created");

          res.json({
            status: true,
            message: `(${req.params.id}) restored successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>clusters/restore - item not found/already restored");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Active`,
      });
    }
  });
};

exports.destroy = (req, res) => {
  console.log(">>clusters/destroy");

  Clusters.findById(req.params.id).then(cluster => {
    if (cluster && cluster.isActive) {
      console.log(">>clusters/destroy - item found");
      Clusters.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date().toLocaleString(),
        isActive: false,
      }).then(() =>
        Logs.create({
          model: "clusters",
          itemId: req.params.id,
          action: "archive",
          member: res.locals.user._id,
        }).then(() => {
          console.log(">>clusters/destroy - logs created");

          res.json({
            status: true,
            message: `(${req.params.id}) archived successfully`,
            content: req.params.id,
          });
        })
      );
    } else {
      console.log(">>clusters/destroy - item not found/already deleted");
      res.status(400).json({
        status: false,
        message: `(${req.params.id}) is already Inactive`,
      });
    }
  });
};
