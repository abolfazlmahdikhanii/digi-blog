import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import commentsModel from "@/models/comments";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await connectToDB();
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    const { content, commentId } = req.body;
   
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
    if (!content.trim()) {
      return res.status(421).json({ message: "fill the field!" });
    }
    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    const newComment = commentsModel.create({
      content,
      author: user._id,
      post: id,
      parentComment: commentId || null,
      status: "pending",
    });
    if (!newComment) {
      return res.status(400).json({ message: "Create Comment Has Problem!" });
    }
    return res.status(200).json({ message: "Create Comment Successfully :)" });
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
