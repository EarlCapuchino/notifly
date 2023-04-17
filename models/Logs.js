const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

modelSchema.query.byModel = function (model) {
  return this.where({ model });
};

modelSchema.query.byMember = function (member) {
  return this.where({ member });
};

module.exports = mongoose.model("Logs", modelSchema);
