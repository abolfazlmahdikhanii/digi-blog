import mongoose, { Schema } from "mongoose";
import postModel from "./posts";
const saveSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    listId: {
      type: mongoose.Types.ObjectId,
      ref: "Save_List",
      required: true,
    },
  },
  { timestamps: true }
);

saveSchema.index({ postId: 1, userId: 1 }, { unique: true });

const saveModel = mongoose.models.Save || mongoose.model("Save", saveSchema);
export default saveModel;
