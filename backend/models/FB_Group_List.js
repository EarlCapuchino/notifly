const mongoose = require("mongoose");

const FB_Group_List = mongoose.model(
  "FB_Group_List",
  new mongoose.Schema({
    fbGroupListName: String,
    urls: [],
    createdAt: Date,
  })
);

module.exports = FB_Group_List;