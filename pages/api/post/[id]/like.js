import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import notifyModel from "@/models/notifications";
import postLikesModel from "@/models/postLikes";
import postModel from "@/models/posts";
import usersModel from "@/models/users";
import { isValidObjectId } from "mongoose";

const addLike = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }
    const post = await postModel
      .findOne({ _id: id, status: "published" })
      .populate("author", "name username")
      .lean();
    if (!post) {
      return res.status(404).json({ message: "Not Found Post !" });
    }
    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const isLikeUser = await postLikesModel.findOne({
      postId: id,
      userId: user._id,
    });

    if (!isLikeUser) {
      const newLike = postLikesModel.create({
        userId: user._id,
        postId: id,
      });
      if (!newLike) {
        return res.status(400).json({ message: "Create Like Has Problem!" });
      }
      await notifyModel.create({
        userId: post.author._id,
        title: "Post Liked",
        type: "POST_LIKE",
        message: `${user.name} liked your post "${post.title}"`,
        metadata: {
          url: `/@${post.author.username}/${post.slug}`,
        },
        isRead: false,
      });
      return res.status(200).json({ message: "Create Like Successfully :)" });
    } else {
      const removeLike = await postLikesModel.deleteOne({
        _id: isLikeUser._id,
      });

      if (!removeLike.deletedCount) {
        return res.status(400).json({ message: "Remove Like Has Problem!" });
      }
      return res.status(200).json({ message: "Remove Like Successfully :)" });
    }
  } catch (error) {
   
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const getLike = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;

    const validToken = verifyToken(token);

    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const likes = await postLikesModel.find({
      postId: id,
    });

    if (!likes) {
      return res.status(400).json({
        message: "Get Like Has Problem!",
        likes: 0,
        isCurrentUserLike: false,
      });
    }
    const isCurrentUserLike = likes.find(
      (item) => item.userId.toString() === user._id.toString()
    );
    return res.status(200).json({
      message: "Get Like Successfully :)",
      likes: likes.length,
      isCurrentUserLike: isCurrentUserLike ? true : false,
    });
  } catch (error) {
   
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "POST") {
    await addLike(req, res);
  } else if (req.method === "GET") {
    await getLike(req, res);
  } else return res.status(405).end();
};

export default handler;
