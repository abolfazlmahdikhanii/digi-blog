import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";
import notifyModel from "@/models/notifications";
import saveModel from "@/models/save";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const followHandler = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { username } = req.query;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const currentUser = await usersModel.findOne({ email: validToken.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    const targetUser = await usersModel.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    if (currentUser._id.toString() === targetUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Users cannot follow themselves" });
    }

    const existFollow = await followModel.findOne({
      follower: currentUser._id,
      following: targetUser._id,
    });

    if (!existFollow) {
      const newFollow = followModel.create({
        follower: currentUser._id,
        following: targetUser._id,
      });
      if (!newFollow) {
        return res.status(400).json({ message: "Follow User Has Problem!" });
      }
      await notifyModel.create({
        userId: targetUser._id,
        title: "New Follower",
        type: "NEW_FOLLOWER",
        message: `${currentUser.name} started following you`,
        metadata: { url: `/@${currentUser.username}` },
        isRead: false,
      });
      return res.status(200).json({ message: "Follow User Successfully :)" });
    } else {
      const unFollow = await followModel.deleteOne({
        _id: existFollow._id,
      });

      if (!unFollow.deletedCount) {
        return res.status(400).json({ message: "unFollow Has Problem!" });
      }
      return res.status(200).json({ message: "unFollow Successfully :)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const getFollow = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { username } = req.query;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const currentUser = await usersModel.findOne({ email: validToken.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    const targetUser = await usersModel.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const follow = await followModel.findOne({
      follower: currentUser._id,
      following: targetUser._id,
    });

    return res.status(200).json({
      message: "Get Follow Successfully :)",
      isFollow: follow ? true : false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await followHandler(req, res);
  } else if (req.method === "GET") {
    await getFollow(req, res);
  } else return res.status(405).end();
};

export default handler;
