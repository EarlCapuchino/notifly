const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
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

modelSchema.query.byActive = function (isActive) {
  return this.where({ isActive });
};

module.exports = mongoose.model("Meetings", modelSchema);
