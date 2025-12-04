import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";

const handler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  await connectToDB();

  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    let currentUser = null;
    if (validToken) {
      currentUser = await usersModel.findOne({ email: validToken.email });
    }
    const topics = await topicModel.find({}).sort({ createdAt: -1 }).limit(10);
    const userFilter = currentUser ? { _id: { $ne: currentUser._id } } : {};
    const users = await usersModel
      .find(userFilter)
      .sort({ createdAt: -1 })
      .limit(5)

      .lean();

    res.status(200).json({
      message: "Get Topics SuccessFully",
      topics: topics || [],
      whoFollow: users || [],
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default handler;
