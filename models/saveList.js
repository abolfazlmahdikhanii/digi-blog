import mongoose, { Schema } from "mongoose";

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      max: 60,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

listSchema.virtual("saveItems", {
  ref: "Save",
  localField: "_id",
  foreignField: "listId",
  
});

const saveListModel =
  mongoose.models.Save_List || mongoose.model("Save_List", listSchema);
export default saveListModel;
