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
    const { slug, page = 1, limit = 10 } = req.query;
    const { token } = req.cookies;

    const validToken = verifyToken(token);
    let currentUser = null;
    if (validToken) {
      currentUser = await usersModel.findOne({ email: validToken.email });
    }

    if (!slug || slug.trim() === "") {
      return res.status(400).json({ message: "Valid topic is required" });
    }
    const topic = await topicModel.findOne({ slug });
    if (!topic) {
      return res.status(404).json({ message: "Not Found Topic!" });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get all posts for this topic
    const allPosts = await postModel
      .find({
        topics: { $in: [topic._id] },
        status: "published",
      })
      .populate("topics")
      .populate({ path: "comments" })
      .populate({ path: "likes" })
      .populate({ path: "save", match: { userId: currentUser?._id } })
      .populate("author", "name username")
      .populate("postCover")
      .sort({ updatedAt: -1 });
    const postsWithEngagement = allPosts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      totalEngagement:
        (post.likes?.length || 0) * 2 + (post.comments?.length || 0) * 3,
    }));

    // Get recommended posts (sorted by engagement + recency)
    const recommendedPosts = postsWithEngagement.sort((a, b) => {
      // Calculate score: engagement weighted by recency
      const now = Date.now();
      const aHoursSinceCreated =
        (now - new Date(a.createdAt).getTime()) / (1000 * 60 * 60);
      const bHoursSinceCreated =
        (now - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);

      const aScore =
        (a.likesCount * 2 + a.commentsCount * 3) /
        Math.log10(Math.max(aHoursSinceCreated, 2));
      const bScore =
        (b.likesCount * 2 + b.commentsCount * 3) /
        Math.log10(Math.max(bHoursSinceCreated, 2));

      return bScore - aScore;
    });

    const paginatedPosts = recommendedPosts.slice(skip, skip + limitNum);
    const hasMore = skip + paginatedPosts.length < recommendedPosts.length;

    return res.status(200).json({
      posts: JSON.parse(JSON.stringify(paginatedPosts)),
      hasMore,
      total: paginatedPosts.length,
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
