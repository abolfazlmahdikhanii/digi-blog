const { Schema, default: mongoose } = require("mongoose");
import categoryModel from "./category";
import commentsModel from "./comments";
import usersModel from "./users";
const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      unique: true,
    },
    content: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "draft",
    },
    shortDescription: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
    postCover: {
      type: String,
      required: true,
    },
    readTime: {
      type: Number,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    isShowComment: {
      type: Number,
      max: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "post",
});

const postModel = mongoose.models.Posts || mongoose.model("Posts", schema);
export default postModel;
