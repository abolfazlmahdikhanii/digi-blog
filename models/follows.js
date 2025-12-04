import mongoose, { Schema } from "mongoose";
const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "muted"], // Medium allows muting followed users
      default: "active",
    },
    notificationsEnabled: {
      type: Boolean,
      default: true, // Get notified when they publish
    },
  },
  {
    timestamps: true,
  }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel =
  mongoose.models.Follow || mongoose.model("Follow", followSchema);
export default followModel;
