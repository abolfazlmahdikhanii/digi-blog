const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema({
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
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
});

const postModel = mongoose.models.Posts || mongoose.model("Posts", schema);
export default postModel;
