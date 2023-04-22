const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    urls: [
      {
        type: String,
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

modelSchema.query.byActive = function (isActive) {
  return this.where({ isActive });
};

module.exports = mongoose.model("fb_group_lists", modelSchema);
