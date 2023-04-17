const mongoose = require("mongoose");

const Cluster = mongoose.model(
  "Cluster",
  new mongoose.Schema({
    cluster_name: String,
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  })
);

module.exports = Cluster;
