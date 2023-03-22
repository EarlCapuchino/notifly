const mongoose = require("mongoose");

const Group_List = mongoose.model(
  "Group_List",
  new mongoose.Schema({
    groupListName: String,
    urls: [],
    createdAt: Date,
  })
);

module.exports = Group_List;