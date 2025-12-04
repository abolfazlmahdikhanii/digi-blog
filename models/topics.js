const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const topicModel = mongoose.models.Topics || mongoose.model("Topics", schema);
export default topicModel;
