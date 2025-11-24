const { default: connectToDB } = require("@/configs/db");
const { verifyToken } = require("@/lib/utils");
const { default: postModel } = require("@/models/posts");
const { default: topicModel } = require("@/models/topics");
const { default: usersModel } = require("@/models/users");

const handler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectToDB();

  try {
    const { slug, page = "1", limit = "10" } = req.query;
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

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // fetch posts and dedupe authors (your original approach)
    const posts = await postModel
      .find({
        topics: { $in: [topic._id] },
        status: "published",
      })
      .populate("author", "name profileImage bio username")
      .select("author")
      .lean();

    // build unique authors list
    const authorMap = new Map();
    posts.forEach((p) => {
      if (p.author && !authorMap.has(String(p.author._id))) {
        authorMap.set(String(p.author._id), p.author);
      }
    });

    const uniqueAuthors = Array.from(authorMap.values());

    // Optionally exclude current user from recommendations
    const filteredAuthors = currentUser
      ? uniqueAuthors.filter((a) => String(a._id) !== String(currentUser._id))
      : uniqueAuthors;

    const totalUnique = filteredAuthors.length;
    const paged = filteredAuthors.slice(skip, skip + limitNum);

    // correct hasMore calculation:
    const hasMore = skip + paged.length < totalUnique;

    return res.status(200).json({
      authors: paged,
      hasMore,
      total: totalUnique,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
