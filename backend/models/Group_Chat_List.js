const mongoose = require("mongoose");

const Group_Chat_List = mongoose.model(
  "Group_Chat_List",
  new mongoose.Schema({
    groupChatListName: String,
    urls: [],
    createdAt: Date,
  })
);

module.exports = Group_Chat_List;