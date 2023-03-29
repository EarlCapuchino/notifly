const mongoose = require("mongoose");

const Meeting = mongoose.model(
  "Meeting",
  new mongoose.Schema({
    title: String,
    date: Date,
    content: String,
    createdAt: Date,
  })
);

module.exports = Meeting;