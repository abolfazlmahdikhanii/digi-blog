import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
      index: true,
    },
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "Comments",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

const likesModel =
  mongoose.models.CommentLikes || mongoose.model("CommentLikes", likeSchema);
export default likesModel;
