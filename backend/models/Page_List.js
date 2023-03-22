const mongoose = require("mongoose");

const Page_List = mongoose.model(
  "Page_List",
  new mongoose.Schema({
    pageListName: String,
    urls: [],
    createdAt: Date,
  })
);

module.exports = Page_List;