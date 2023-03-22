const mongoose = require("mongoose");

const Postlist = mongoose.model(
  "Postlist",
  new mongoose.Schema({
    listname: String,
  })
);

module.exports = Postlist;