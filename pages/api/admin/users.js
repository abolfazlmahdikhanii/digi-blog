const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";

const getAllUsers = async (req, res) => {
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
    if (currentUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied! Admin Only." });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await usersModel.countDocuments({});
    const users = await usersModel
      .find({})
      .skip(skip)
      .lean({ virtuals: true })
      .sort({ updatedAt: -1 });
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit));
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    // hasMore true when there are pages after current
    const hasMore = page < totalPages;
    const nextPage = hasNext ? page + 1 : null;
    const prevPage = hasPrev ? page - 1 : null;
    return res.status(200).json({
      users: JSON.parse(JSON.stringify(users)),
      hasMore,
      nextPage,
      prevPage,
      totalPosts: totalUsers,
      currentPage: page,
    });
  } catch (error) {
  
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();

  if (req.method === "GET") {
    await getAllUsers(req, res);
    return;
  } else return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
