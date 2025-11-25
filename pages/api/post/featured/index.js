const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";
import postModel from "@/models/posts";
import usersModel from "@/models/users";

const getFeaturedPosts = async (req, res) => {
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
    const following = await followModel.find({ follower: currentUser._id });
    // Check if user has interests
    if (!following || following.length === 0) {
      return res.status(200).json({
        posts: [],
        hasMore: false,
        totalPosts: 0,
        currentPage: 1,
        message: "No featured set for user",
      });
    }
    const followingUserIds = following.map((follow) => follow.following);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Build query to exclude posts that match user's interests
    const query = {
      status: "published",
      author: { $in: followingUserIds },
    };

    // If user has interests, exclude posts with those topics
    if (currentUser.interests && currentUser.interests.length > 0) {
      query.topics = { $nin: currentUser.interests };
    }
    const totalPosts = await postModel.countDocuments(query);

    const posts = await postModel
      .find(query)
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
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "GET") {
    await getFeaturedPosts(req, res);
    return;
  } else return res.status(405).end();
};

export default handler;
