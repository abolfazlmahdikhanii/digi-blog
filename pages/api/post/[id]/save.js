import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import saveModel from "@/models/save";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const addSave = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    const { listId } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    if (!isValidObjectId(id) || !isValidObjectId(listId)) {
      return res.status(404).json({ message: "Invalid post id or list id !" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const isSaveUser = await saveModel.findOne({
      postId: id,
      userId: user._id,
      listId,
    });

    if (!isSaveUser) {
      const newSave = saveModel.create({
        userId: user._id,
        postId: id,
        listId,
      });
      if (!newSave) {
        return res.status(400).json({ message: "Create Save Has Problem!" });
      }
      return res.status(200).json({ message: "Create Save Successfully :)" });
    } else {
      const removeSave = await saveModel.deleteOne({
        _id: isSaveUser._id,
      });

      if (!removeSave.deletedCount) {
        return res.status(400).json({ message: "Remove Save Has Problem!" });
      }
      return res.status(200).json({ message: "Remove Save Successfully :)" });
    }
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const getSave = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;

    const validToken = verifyToken(token);

    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const saves = await saveModel.find({
      postId: id,
      userId: user._id,
    });

    if (!saves) {
      return res.status(400).json({
        message: "Get Save Has Problem!",
        isUserSave: false,
      });
    }

    return res.status(200).json({
      message: "Get Save Successfully :)",

      isUserSave: saves.length ? true : false,
    });
  } catch (error) {
  
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await addSave(req, res);
  } else if (req.method === "GET") {
    await getSave(req, res);
  } else return res.status(405).end();
};

export default handler;
