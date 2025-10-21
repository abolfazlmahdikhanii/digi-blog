const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";
import usersModel from "@/models/users";
import postSchema from "@/validations/post";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
const getAllPosts = async (req, res) => {};
const createNewPost = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      category,
      title,
      content,
      shortDescription,
      tags,
      postCover,
      author,
      status,
    } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const validPost = postSchema.parse({
      title,
      content,
      shortDescription,
      tags,
      postCover,
      status
    });
    if (!validPost) {
      return res.status(400).json({ message: "Invalid Post Data!" });
    }

    console.log(title);
    const user = await usersModel.findOne({ email: validToken.email }, "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = await postModel.create({
      title: validPost.title,
      content: validPost.content,
      shortDescription: validPost.shortDescription,
      category,
      tags: validPost.tags,
      postCover: validPost.postCover,
      author: user._id,
      status: validPost.status,
    });
    if (!newPost) {
      return res.status(400).json({ message: "Created Post Has Problem!" });
    }
    return res.status(200).json({ message: "Created Post Successfully:)" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await createNewPost(req, res);
  }
};

export default handler;
