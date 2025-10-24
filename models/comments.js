const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    parentComment: {
      type: mongoose.Types.ObjectId,
      ref: "Comments",
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
schema.virtual("replies", {
  ref: "Comments",
  localField: "_id",
  foreignField: "parentComment",
});
schema.virtual("likes", {
  ref: "CommentLikes",
  localField: "_id",
  foreignField: "commentId",
  
});
schema.set("toJSON", { virtuals: true });
const commentsModel =
  mongoose.models.Comments || mongoose.model("Comments", schema);
export default commentsModel;
