const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import saveModel from "@/models/save";
import saveListModel from "@/models/saveList";
import usersModel from "@/models/users";

import { isValidObjectId } from "mongoose";
const removeList = async (req, res) => {
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
    const removeSaveList = await saveListModel.findOneAndDelete({
      _id: id,
      userId: user._id,
    });
    await saveModel.findOneAndDelete({
      listId: id,
      userId: user._id,
    });

    if (!removeSaveList) {
      return res.status(404).json({ message: "List not Remove" });
    }
    return res.status(200).json({ message: "List  Remove" });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const updateStatus = async (req, res) => {
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
    const saveList = await saveListModel.findOne({
      _id: id,
      userId: user._id,
    });
    if (!saveList) {
      return res.status(404).json({ message: "List not found!" });
    }
    const updateSaveList = await saveListModel.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      { isPrivate: !saveList.isPrivate }
    );
    if (!updateSaveList) {
      return res.status(404).json({ message: "List not update" });
    }
    return res.status(200).json({ message: "List  update" });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "DELETE") await removeList(req, res);
  else if (req.method === "PUT") await updateStatus(req, res);
  else return res.status(405).end();
};

export default handler;
