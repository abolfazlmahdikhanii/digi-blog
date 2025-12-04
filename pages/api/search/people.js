import connectToDB from "@/configs/db";

import postModel from "@/models/posts";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";

const handler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectToDB();

  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "Valid search query is required" });
    }

    const trimmedQuery = q.trim();
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
  const totalCount = await usersModel.countDocuments({
    name: { $regex: trimmedQuery, $options: "i" },
    });
    const people = await usersModel
      .find({
        name: { $regex: trimmedQuery, $options: "i" },
      })
      .skip(skip)
      .limit(limitNum)
      .lean();
    const hasMore = skip + people.length < totalCount;

    return res.status(200).json({
      people: JSON.parse(JSON.stringify(people)),
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
