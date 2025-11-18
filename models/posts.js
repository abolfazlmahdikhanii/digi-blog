const { Schema, default: mongoose } = require("mongoose");

import topicModel from "./topics";
import commentsModel from "./comments";
import usersModel from "./users";
import postLikesModel from "./postLikes";
import saveModel from "./save";
import postImagesModel from "./potsImages";
const schema = new Schema(
  {
    title: {
      type: String,

      min: 2,
    },
    slug: {
      type: String,
      index: true,
      min: 2,
      unique: true,
    },
    content: {
      type: Object,
    },
    status: {
      type: String,
      required: true,
      default: "draft",
    },
    shortDescription: {
      type: String,
    },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topics" }],
    postCover: {
      type: mongoose.Types.ObjectId,
      ref: "Post_Images",
    },
    readTime: {
      type: Number,
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
schema.index(
  { content: true },
  {
    required: true,
    partialFilterExpression: { status: "published" },
  }
);
schema.index(
  { title: true },
  {
    required: true,
    partialFilterExpression: { status: "published" },
  }
);
schema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "post",
});
schema.virtual("likes", {
  ref: "Post_Likes",
  localField: "_id",
  foreignField: "postId",
});
schema.virtual("save", {
  ref: "Save",
  localField: "_id",
  foreignField: "postId",
});

const postModel = mongoose.models.Posts || mongoose.model("Posts", schema);
export default postModel;
