import mongoose, { Schema } from "mongoose";

const NotificationType = {
  NEW_COMMENT: "NEW_COMMENT",
  COMMENT_REPLY: "COMMENT_REPLY",
  POST_LIKE: "POST_LIKE",
  NEW_FOLLOWER: "NEW_FOLLOWER",
  POST_PUBLISHED: "POST_PUBLISHED",
  MENTION: "MENTION",
  SYSTEM: "SYSTEM",
};
const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

const notifyModel =
  mongoose.models.Notifications ||
  mongoose.model("Notifications", notificationSchema);
export default notifyModel;
