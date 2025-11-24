import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import saveListModel from "@/models/saveList";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const addSaveList = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { name, description, isPrivate } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    if (!name) {
      return res.status(404).json({ message: "Fill The Name Filed !" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const newList = saveListModel.create({
      userId: user._id,
      name,
      isPrivate,
      description,
    });

    if (!newList) {
      return res.status(400).json({ message: "Create Save List Has Problem!" });
    }
    return res
      .status(200)
      .json({ message: "Create Save List Successfully :)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const getSaveList = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }
    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const saveLists = await saveListModel
      .find({
        userId: user._id,
      })
      .populate({ path: "saveItems", match: { postId: id,userId:user._id } })
      .lean()
    if (!saveLists) {
      return res.status(400).json({
        message: "Get Save List Has Problem!",
        lists: [],
      });
    }

    return res.status(200).json({
      message: "Get Save List Successfully :)",

      lists: saveLists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await addSaveList(req, res);
  } else if (req.method === "GET") {
    await getSaveList(req, res);
  } else return res.status(405).end();
};

export default handler;
