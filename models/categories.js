const { Schema, default: mongoose } = require("mongoose");

const schema = new Schema({
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
});

const categoryModel =
  mongoose.models.Categories || mongoose.model("Categories", schema);
export default categoryModel;
