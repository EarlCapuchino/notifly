const mongoose = require("mongoose");

const Member = mongoose.model(
  "Member",
  new mongoose.Schema({
    name: String,
    nickname: String,
    email: String,
    username: String,
    user_id: String,
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cluster"
    }
  })
);

module.exports = Member;