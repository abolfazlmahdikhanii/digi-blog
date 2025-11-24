const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";
import usersModel from "@/models/users";
import commentModel from "@/models/comments";

const getAdminInfo = async (req, res) => {
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
      return res.status(404).json({ message: "User Not Found!" });
    }

    if (currentUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied! Admin Only." });
    }

    // Get current date and dates for comparison
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Users
    const totalUsers = await usersModel.countDocuments();
    const usersLastMonth = await usersModel.countDocuments({
      createdAt: { $gte: lastMonth },
    });
    const usersThisMonth = await usersModel.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });
    const usersPreviousMonth = await usersModel.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const userGrowthPercent =
      usersPreviousMonth > 0
        ? (
            ((usersThisMonth - usersPreviousMonth) / usersPreviousMonth) *
            100
          ).toFixed(1)
        : 0;

    // Total Posts
    const totalPosts = await postModel.countDocuments({
      status: "published",
    });
    const postsLastMonth = await postModel.countDocuments({
      status: "published",
      createdAt: { $gte: lastMonth },
    });
    const postsThisMonth = await postModel.countDocuments({
      status: "published",
      createdAt: { $gte: startOfThisMonth },
    });
    const postsPreviousMonth = await postModel.countDocuments({
      status: "published",
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const postGrowth = postsThisMonth - postsPreviousMonth;

    // Total Comments
    const totalComments = await commentModel.countDocuments();
    const commentsThisMonth = await commentModel.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });
    const commentsPreviousMonth = await commentModel.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const commentGrowthPercent =
      commentsPreviousMonth > 0
        ? (
            ((commentsThisMonth - commentsPreviousMonth) /
              commentsPreviousMonth) *
            100
          ).toFixed(0)
        : 0;

    // User Growth Chart Data (last 6 months)
    const chartData = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const usersCount = await usersModel.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      chartData.push({
        name: monthNames[monthStart.getMonth()],
        users: usersCount,
      });
    }

    // Recent Posts (last 10 published posts)
    const recentPosts = await postModel
      .find()
      .select("title author status createdAt slug")
      .populate("author", "username name profilePicture")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      stats: {
        totalUsers: {
          count: totalUsers,
          change: `+${userGrowthPercent}% from last month`,
        },
        totalPosts: {
          count: totalPosts,
          change: `+${postGrowth} from last month`,
        },
        totalComments: {
          count: totalComments,
          change: `+${commentGrowthPercent}% from last month`,
        },
      },
      chartData,
      recentPosts,
    });
  } catch (error) {
    console.log("Admin Info Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "GET") {
    await getAdminInfo(req, res);
    return;
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
