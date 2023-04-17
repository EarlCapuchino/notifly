const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    customId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
      default: "",
    },
    username: {
      type: String,
      trim: true,
      default: "",
    },
    clusters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clusters",
      },
    ],
    deletedAt: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Members", modelSchema);
