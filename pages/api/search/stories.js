import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";

import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";

const handler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectToDB();

  try {
    const { q, page = 1, limit = 10 } = req.query;
    const { token } = req.cookies;

    const validToken = verifyToken(token);
    let currentUser = null;
    if (validToken) {
      currentUser = await usersModel.findOne({ email: validToken.email });
    }

    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "Valid search query is required" });
    }

    const trimmedQuery = q.trim();
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const totalCount = await postModel.countDocuments({
      title: { $regex: trimmedQuery, $options: "i" },
      status: "published",
    });
    const stories = await postModel
      .find({
        title: { $regex: trimmedQuery, $options: "i" },
        status: "published",
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "name username")
      .populate("postCover")
      .skip(skip)
      .limit(limitNum)
      .sort({updatedAt:-1})
      .lean({ virtuals: true });

    const hasMore = skip + stories.length < totalCount;

    return res.status(200).json({
      stories: JSON.parse(JSON.stringify(stories)),
      hasMore,
      total: totalCount,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default handler;
