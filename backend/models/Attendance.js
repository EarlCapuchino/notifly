const mongoose = require("mongoose");

const Attendance = mongoose.model(
  "Attendance",
  new mongoose.Schema({
    title: String,
    password: String,
    createdAt: Date,
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member"
        }
    ] 
  })
);

module.exports = Attendance;