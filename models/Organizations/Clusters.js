const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clusters", modelSchema);
