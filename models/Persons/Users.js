const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      fname: {
        type: String,
        trim: true,
        required: true,
      },
      mname: {
        type: String,
        trim: true,
        default: "",
      },
      lname: {
        type: String,
        trim: true,
        required: true,
      },
      suffix: {
        type: String,
        default: "",
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },
      barangay: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      province: {
        type: String,
        trim: true,
        default: "",
      },
      region: {
        type: String,
        trim: true,
        default: "",
      },
    },
    dob: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "guest",
    },
    mobile: {
      type: String,
      unique: true,
      maxlength: 10,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    alias: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isMale: {
      type: Boolean,
      default: false,
    },
    rate: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
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

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.query.byActive = function (isActive) {
  return this.where({ isActive });
};

userSchema.query.byRole = function (role) {
  return this.where({ role });
};

module.exports = mongoose.model("Users", userSchema);
