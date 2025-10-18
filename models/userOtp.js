const { Mongoose, default: mongoose } = require("mongoose");

const schema = mongoose.Schema(
  {
    email: {
      type: "String",
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expireTime: {
      type: Number,
      required: true,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    used: {
      type: Number,
      default: 0,
    },
    blockedUntil: {
      type: Number,
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.models.UserOtp || mongoose.model("UserOtp", schema);

export default otpModel;
