const { default: connectToDB } = require("@/configs/db");
import { verifyToken } from "@/lib/utils";
import notifyModel from "@/models/notifications";
import postModel from "@/models/posts";
import postImagesModel from "@/models/potsImages";
import topicModel from "@/models/topics";
import usersModel from "@/models/users";
import postSchema from "@/validations/post";
import { isValidObjectId } from "mongoose";
import slugify from "slugify";
import { z } from "zod";


const createNewPost = async (req, res) => {
  try {
    const { token } = req.cookies;
    const {
      title,
      content,
      shortDescription,
      topics,
      postCover,
      author,
      status,
      readTime,
      isShowComment,
      postId,
      imgId,
    } = req.body;
   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const validPost = postSchema.parse({
      title,
      content,
      shortDescription,

      readTime,
      isShowComment,
    });
    if (!validPost) {
      return res.status(400).json({ message: "Invalid Post Data!" });
    }
    if (topics && Array.isArray(topics)) {
      if (topics.length > 5) {
        return res.status(400).json({
          message: "Maximum 5 topics allowed per post",
        });
      }

      // Validate all topic IDs exist
      const validTopicIds = topics.filter((id) => isValidObjectId(id));
      if (validTopicIds.length !== topics.length) {
        return res.status(400).json({
          message: "Invalid topic IDs provided",
        });
      }

      const topicsExist = await topicModel.find({
        _id: { $in: validTopicIds },
      });

      if (topicsExist.length !== validTopicIds.length) {
        return res.status(400).json({
          message: "Some topics do not exist",
        });
      }
    }
    // Generate unique slug
    let slug = slugify(validPost.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug exists and make it unique
    let slugExists = await postModel.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(validPost.title, {
        lower: true,
        strict: true,
      })}-${counter}`;
      slugExists = await postModel.findOne({ slug });
      counter++;
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (postId && isValidObjectId(postId)) {
      const updatePost = await postModel.findOneAndUpdate(
        { _id: postId, author: user._id },
        {
          title: validPost.title,
          slug,
          content: validPost.content,
          shortDescription: validPost.shortDescription,

          topics: topics || [],
          postCover: imgId,
          author: user._id,
          status: status || "published",
          readTime: validPost.readTime,
          isShowComment: validPost.isShowComment,
        }
      );
      if (!updatePost) {
        return res.status(400).json({ message: "Created Post Has Problem!" });
      }
      await notifyModel.create({
        userId: user._id,
        title: "New Post",
        type: "POST_PUBLISHED",
        message: `${user.name} published a new post: "${validPost.title}"`,
        metadata: {
          url: `/@${updatePost.author.username}/${updatePost.slug}`,
        },
        isRead: false,
      });
      return res.status(200).json({ message: "Created Post Successfully:)" });
    } else {
      const newPost = await postModel.create({
        title: validPost.title,
        slug,
        content: validPost.content,
        shortDescription: validPost.shortDescription,
        topics: topics || [],
        postCover: imgId,
        author: user._id,
        status: status || "published",
        readTime: validPost.readTime,
        isShowComment: validPost.isShowComment,
      });
      if (!newPost) {
        return res.status(400).json({ message: "Created Post Has Problem!" });
      }

      await notifyModel.create({
        userId: user._id,
        title: "New Post",
        type: "POST_PUBLISHED",
        message: `${user.name} published a new post: "${validPost.title}"`,
        metadata: {
          url: `/@${newPost.author.username}/${newPost.slug}`,
        },
        isRead: false,
      });
      return res.status(200).json({ message: "Created Post Successfully:)" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const createDraftPost = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { title, content, status, postId } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await usersModel.findOne({ email: validToken.email }, "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate slug for draft too
    let slug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Check if slug exists and make it unique
    let slugExists = await postModel.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${slugify(title, {
        lower: true,
        strict: true,
      })}-${counter}`;
      slugExists = await postModel.findOne({ slug });
      counter++;
    }

    if (postId && isValidObjectId(postId)) {
      const updatePost = await postModel.findOneAndUpdate(
        { _id: postId, author: user._id },
        {
          title,
          content,
          author: user._id,
          status: "draft",
        }
      );
      if (!updatePost) {
        return res.status(400).json({ message: "Created Post Has Problem!" });
      }

      return res
        .status(200)
        .json({ message: "Created Post Successfully:)", id: updatePost._id });
    } else {
      const newPost = await postModel.create({
        title,
        slug,
        content,
        author: user._id,
        status: "draft",
      });
      if (!newPost) {
        return res.status(400).json({ message: "Created Post Has Problem!" });
      }

      return res
        .status(200)
        .json({ message: "Created Post Successfully:)", id: newPost._id });
    }
  } catch (error) {
    
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  const { status } = req.body;

  if (req.method === "POST") {
    if (status === "draft") {
      await createDraftPost(req, res);
      return;
    } else {
      await createNewPost(req, res);
      return;
    }
  } 
};

export default handler;
