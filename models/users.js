const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    username: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 30,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    job: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: 200,
    },
    profileImg: {
      type: String,
    },
  },
  { timestamps: true }
);

const usersModel = mongoose.model.Users || mongoose.model("User", schema);
export default usersModel;
