const { default: mongoose } = require("mongoose");
import postModel from "./posts";
const schema = new mongoose.Schema(
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
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "USER",
    },
    imgId: {
      type: String,
    },
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics",
      },
    ],
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
schema.virtual("posts", {
  ref: "Posts",
  localField: "_id",
  foreignField: "author",
});
const usersModel = mongoose.models.Users || mongoose.model("Users", schema);
export default usersModel;
