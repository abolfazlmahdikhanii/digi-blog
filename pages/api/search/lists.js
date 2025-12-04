import connectToDB from "@/configs/db";

import postModel from "@/models/posts";
import saveListModel from "@/models/saveList";
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
    const totalCount = await saveListModel.countDocuments({
      name: { $regex: trimmedQuery, $options: "i" },
      isPrivate: false,
    });
    const lists = await saveListModel
      .find({
        name: { $regex: trimmedQuery, $options: "i" },
        isPrivate: false,
      })
      .populate({
        path: "saveItems",
        options: {
          limit: 3, // limit items for preview
          sort: { createdAt: -1 },
        },
        populate: {
          path: "postId",
          select: "title slug createdAt", // select fields you need from post
          populate: [
            {
              path: "author",
              select: "name username profileImage", // select author fields
            },
            {
              path: "postCover",
              select: "imageUrl fileName", // select image fields
            },
          ],
        },
      })
      .populate("userId", "name username profileImage") // get list owner info
      .select("name description createdAt itemCount isPrivate") // select list fields
      .limit(10) // limit number of lists returned
      .sort({ createdAt: -1 }) // sort lists by most recent

      .skip(skip)
      .limit(limitNum)
      .lean();
    const hasMore = skip + lists.length < totalCount;

    return res.status(200).json({
      lists: JSON.parse(JSON.stringify(lists)),
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
