import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import saveListModel from "@/models/saveList";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const getList = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { page = 1, limit = 10 } = req.query;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const totalCount = await saveListModel.countDocuments({
      userId: user._id,
    });
    const lists = await saveListModel
      .find({
        userId: user._id,
      })
      .populate({
        path: "saveItems",
        options: {
          limit: 3,
          sort: { createdAt: -1 },
        },
        populate: [{ path: "postId", select: "postCover" }],
      })
      .skip(skip)
      .limit(limitNum)
      .populate("userId")
      .lean();
    if (!lists) {
      return res.status(400).json({
        message: "Get Save List Has Problem!",
        lists: [],
      });
    }
    const hasMore = skip + lists.length < totalCount;
    return res.status(200).json({
      message: "Get  List Successfully :)",
      lists: JSON.parse(JSON.stringify(lists)),
      total: totalCount,
      hasMore
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  await getList(req, res);
};

export default handler;
