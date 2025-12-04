import connectToDB from "@/configs/db";
import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";

const handler = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectToDB();

  try {
    const { searchQuery, limit = 3 } = req.body;

    if (
      !searchQuery ||
      typeof searchQuery !== "string" ||
      searchQuery.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Valid search query is required" });
    }

    const trimmedQuery = searchQuery.trim();

    const [users, posts, topics] = await Promise.all([
      usersModel
        .find(
          {
            name: { $regex: trimmedQuery, $options: "i" },
          },
          "_id name username profileImage email"
        )
        .limit(limit),
      postModel
        .find(
          {
            title: { $regex: trimmedQuery, $options: "i" },
            status: "published",
          },
          "_id title slug postCover author createdAt"
        )
        .populate("author", "name username")
        .populate("postCover")
        .limit(limit)
        .sort({ createdAt: -1 }),
      topicModel
        .find({
          name: { $regex: trimmedQuery, $options: "i" },
        })
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        posts,
        topics,
      },
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
