import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";

import usersModel from "@/models/users";

const getPost = async (req, res) => {
  try {
    const { token } = req.cookies;

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

    const posts = await postModel
      .find({
        author: user._id,
      })
      .populate("topics")
      .populate("author")
      .populate("postCover")
      .lean();
    if (!posts) {
      return res.status(400).json({
        message: "Get Post Has Problem!",
        posts: [],
      });
    }

    return res.status(200).json({
      message: "Get Post Successfully :)",

      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  await getPost(req, res);
};

export default handler;
