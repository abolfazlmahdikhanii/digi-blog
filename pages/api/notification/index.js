import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import notifyModel from "@/models/notifications";
import usersModel from "@/models/users";
import { subDays } from "date-fns/subDays";

const getNotifications = async (req, res) => {
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

    const cutoffDate = subDays(new Date(), 30);

    await notifyModel.deleteMany({
      isRead: true,
      updatedAt: { $lte: cutoffDate },
    });
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const totalCount = await notifyModel.countDocuments({
      userId: user._id,
    });
    const notifications = await notifyModel
      .find({
        userId: user._id,
      })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .populate("userId")
      .lean();
    if (!notifications) {
      return res.status(400).json({
        message: "Get notifications Has Problem!",
        notifications: [],
      });
    }
    const hasMore = skip + notifications.length < totalCount;

    return res.status(200).json({
      message: "Get  notifications Successfully :)",
      notifications: JSON.parse(JSON.stringify(notifications)),
      total: totalCount,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  await getNotifications(req, res);
};

export default handler;
