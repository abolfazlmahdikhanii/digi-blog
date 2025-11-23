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
const getForUserPosts = async (req, res) => {
  try {
    const { token } = req.cookies;
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
    // Check if user has interests
    // if (!currentUser.interests || currentUser.interests.length === 0) {
    //   res.status(200).json({
    //     message: "No interests set for user",
    //   });
    // }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await postModel.countDocuments({
      status: "published",
      $or: [
        {
          topics: { $in: currentUser.interests },
        },
        { author: currentUser._id },
      ],
    });

    const posts = await postModel
      .find({
        status: "published",
        $or: [
          {
            topics: { $in: currentUser.interests },
          },
          { author: currentUser._id },
        ],
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "name username")
      .populate("postCover")
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true })
      .sort({ updatedAt: -1 });

    const hasMore = skip + posts.length < totalPosts;

    return res.status(200).json({
      posts: JSON.parse(JSON.stringify(posts)),
      hasMore,
      totalPosts: totalPosts,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "GET") {
    await getForUserPosts(req, res);
    return;
  } else return res.status(405).end();
};

export default handler;
