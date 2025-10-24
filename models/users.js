const { default: mongoose } = require("mongoose");

const schema =new mongoose.Schema(
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
    role: {
      type: String,
      required: true,
      default: "USER",
    },
  },
  { timestamps: true }
);
schema.virtual("posts",{
  ref:"Posts",
  localField:"_id",
  foreignField:"author"
})
const usersModel = mongoose.models.Users || mongoose.model("Users", schema);
export default usersModel;
