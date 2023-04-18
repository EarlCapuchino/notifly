const Members = require("../../models/Persons/Members"),
  Logs = require("../../models/Logs");

exports.browse = (req, res) =>
  Members.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .populate("clusters")
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

exports.cluster = (req, res) =>
  Members.find()
    .byActive(true)
    .select("-createdAt -updatedAt -__v -isActive")
    .populate("clusters")
    .sort({ createdAt: -1 })
    .lean()
    .then(members => {
      //only fetch members with existing cluster
      const withCluster = members.filter(member => member.clusters.length > 0);

      // container to collect all available cluster
      var clusters = [];

      for (let i = 0; i < withCluster.length; i++) {
        const member = withCluster[i];

        for (let j = 0; j < member.clusters.length; j++) {
          const cluster = member.clusters[j];

          // only push active cluster
          if (cluster.isActive) {
            clusters.push(cluster);
          }
        }
      }

      // remove all duplicate cluster
      const newClusters = Array.from(new Set(clusters.map(cluster => cluster)));

      // add the members to the collected clusters
      const parsedClusters = newClusters?.map(cluster => {
        const newObj = { ...cluster };

        var container = [];

        for (let i = 0; i < withCluster.length; i++) {
          var member = withCluster[i];

          for (let j = 0; j < member.clusters.length; j++) {
            var _cluster = member.clusters[j];

            if (cluster._id === _cluster._id) {
              const _newObj = { ...member };
              _newObj.clusters = undefined;
              container.push(_newObj);
            }
          }
        }

        newObj.members = container;
        newObj.isSelected = false;

        return newObj;
      });

      res.json({
        status: true,
        message: "Fetched Successfully",
        content: parsedClusters,
      });
    })
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
    populate: "clusters",
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
