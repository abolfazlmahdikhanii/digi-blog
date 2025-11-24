const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import postModel from "@/models/posts";
import postImagesModel from "@/models/potsImages";
import usersModel from "@/models/users";
import { deleteFile } from "@/service/fileService";
import { isValidObjectId } from "mongoose";

const handler = async (req, res) => {
  await connectToDB();

  if (req.method !== "DELETE") return res.status(405).end();
  try {
    const { token } = req.cookies;
    const { postId } = req.query;
    if (!isValidObjectId(postId)) {
      return res.status(404).json({ message: "Invalid post id !" });
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied! Admin Only." });
    }
    const removePost = await postModel.findOne({
      _id: postId,
    });

    if (!removePost) {
      return res.status(404).json({ message: "Post not found!" });
    }
    const images = await postImagesModel.find({
      $or: [{ postId: removePost._id }, { _id: removePost.postCover }],
    });
    if (images.length > 0) {
      const imageIds = images.map((img) => img._id);

      // Delete all image files from storage
      for (const image of images) {
        const uploadResult = await deleteFile(image.imageId);

        if (!uploadResult) {
          console.error(`Failed to delete file: ${image.imageId}`);
          // Continue deleting other files instead of returning early
        }
      }
      await postImagesModel.deleteMany({ _id: { $in: imageIds } });
    }

    // Remove the post
    await postModel.findOneAndDelete({ _id: postId });
    return res.status(200).json({ message: "Post  Remove Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
