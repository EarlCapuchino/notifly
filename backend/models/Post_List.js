const mongoose = require("mongoose");

const Post_List = mongoose.model(
  "Post_List",
  new mongoose.Schema({
    postListName: String,
    urls: [],
  })
);

module.exports = Post_List;