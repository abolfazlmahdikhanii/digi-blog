const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";
import usersModel from "@/models/users";
import postSchema from "@/validations/post";
import { isValidObjectId } from "mongoose";
import slugify from "slugify";
import { z } from "zod";

const handler = async (req, res) => {
  await connectToDB();

  if (req.method !== "GET") return res.status(405).end();
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
    const draftPost = await postModel
      .findOne({ _id: id, author: user._id }).lean()
    
    
    if (!draftPost) {
      return res.status(404).json({ message: "Post not found", post: [] });
    }
    return res.status(200).json({ message: "Post  found", post: draftPost });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
