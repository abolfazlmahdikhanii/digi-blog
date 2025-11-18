const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import notifyModel from "@/models/notifications";
import postModel from "@/models/posts";
import postImagesModel from "@/models/potsImages";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";
import postSchema from "@/validations/post";
import { isValidObjectId } from "mongoose";
import slugify from "slugify";
import { z } from "zod";

const savedPublishPost = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    const { title, content } = req.body;

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
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Post Not Found!" });
    }
    const post = await postModel.findOne({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found!" });
    }
    if (!title.trim() || title.length < 3) {
      return res.status(400).json({ message: "Invalid Post Data!" });
    }

    const newPost = await postModel.findOneAndUpdate(
      { _id: post._id, status: "published" },
      {
        title,
        content,
      }
    );
    if (!newPost) {
      return res.status(400).json({ message: "Updated Post Has Problem!" });
    }

    await notifyModel.create({
      userId: user._id,
      title: "Update Post",
      type: "POST_PUBLISHED",
      message: `${user.name} published a new post: "${title}"`,
      metadata: {
        url: `/@${newPost.author.username}/${newPost.slug}`,
      },
      isRead: false,
    });
    return res.status(200).json({ message: "Update Post Successfully:)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "POST") {
    await savedPublishPost(req, res);
    return;
  }
};

export default handler;
