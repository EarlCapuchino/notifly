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
        name: {
          type: String,
        },
        messengerId: {
          type: String,
        },
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

module.exports = mongoose.model("group_chat_lists", modelSchema);
