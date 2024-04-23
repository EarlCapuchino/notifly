const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

module.exports = mongoose.model("Clusters", modelSchema);
