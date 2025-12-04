import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";

import topicModel from "@/models/topics";
import usersModel from "@/models/users";

const followHandler = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { slug } = req.query;

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
    const topic = await topicModel.findOne({ slug: slug.trim() });
    if (!topic) {
      return res.status(404).json({ message: "topic Not Found !" });
    }
    // Check if user already follows this topic
    const alreadyFollowing =
      Array.isArray(currentUser.interests) &&
      currentUser.interests.some((id) => String(id) === String(topic._id));

    if (!alreadyFollowing) {
      // Follow: add topic._id to interests (no duplicates)
      const updated = await usersModel.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { interests: topic._id } },
        { new: true }
      );
      if (!updated) {
        return res.status(500).json({ message: "Failed to follow topic" });
      }
      return res.status(200).json({ message: "Follow Topic Successfully :)" });
    } else {
      // Unfollow: remove topic._id from interests
      const updated = await usersModel.findByIdAndUpdate(
        currentUser._id,
        { $pull: { interests: topic._id } },
        { new: true }
      );

      if (!updated) {
        return res.status(500).json({ message: "Failed to unfollow topic" });
      }

      return res.status(200).json({ message: "Unfollowed topic successfully" });
    }
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const getFollow = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { slug } = req.query;
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
    const topic = await topicModel.findOne({ slug: slug.trim() });
    if (!topic) {
      return res.status(404).json({ message: "Topic Not Found !" });
    }
    const isFollow =
      Array.isArray(currentUser.interests) &&
      currentUser.interests.some((id) => String(id) === String(topic._id));

    return res.status(200).json({
      message: "Get Follow Successfully :)",
      isFollow: !!isFollow,
    });
  } catch (error) {
   
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await followHandler(req, res);
  } else if (req.method === "GET") {
    await getFollow(req, res);
  } else return res.status(405).end();
};

export default handler;
