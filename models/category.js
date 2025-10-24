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
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

const categoryModel =
  mongoose.models.Category || mongoose.model("Category", schema);
export default categoryModel;
