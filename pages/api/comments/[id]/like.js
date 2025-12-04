import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import likesModel from "@/models/commentLikes";
import commentsModel from "@/models/comments";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await connectToDB();
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    const { postId } = req.body;

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

    const isLikeUser = await likesModel.findOne({
      commentId: id,
      postId,
      userId: user._id,
    });
   
    if (!isLikeUser) {
      const newLike = likesModel.create({
        commentId: id,
        postId,
        userId: user._id,
      });
      if (!newLike) {
        return res.status(400).json({ message: "Create Like Has Problem!" });
      }
      return res.status(200).json({ message: "Create Like Successfully :)" });
    } else {
      const removeLike = await likesModel.deleteOne({ _id: isLikeUser._id });

      if (!removeLike.deletedCount) {
        return res.status(400).json({ message: "Remove Like Has Problem!" });
      }
      return res.status(200).json({ message: "Remove Like Successfully :)" });
    }
  } catch (error) {
   
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
