const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    imageUrl: {
      type: String,
    },
    imageId: {
      type: String,
    },
    imageType: {
      type: String,
      enum: ["cover", "posts"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref:"Users"
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref:"Posts"
    },
  },
  {
    timestamps: true,
  }
);

const postImagesModel =
  mongoose.models.Post_Images || mongoose.model("Post_Images", schema);
export default postImagesModel;
