const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import notifyModel from "@/models/notifications";
import postModel from "@/models/posts";
import saveModel from "@/models/save";
import saveListModel from "@/models/saveList";
import usersModel from "@/models/users";

import { isValidObjectId } from "mongoose";
const removeNotification = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await usersModel.findOne({ email: validToken.email }, "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const readNotify = await notifyModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
        isRead: false,
      },
      { isRead: true }
    );

    if (!readNotify) {
      return res.status(404).json({ message: "Notification not read" });
    }
    return res.status(200).json({ message: "Notification  Read" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "PUT") await removeNotification(req, res);
  else return res.status(405).end();
};

export default handler;
