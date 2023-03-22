const mongoose = require("mongoose");

const Announcement = mongoose.model(
  "Announcement",
  new mongoose.Schema({
    title: String,
    createdAt: Date,
    content: String
  })
);

module.exports = Announcement;