import { verifyToken } from "@/lib/utils";
import topicModel from "@/models/topics";
import topicSchema from "@/validations/topics";
import slugify from "slugify";

import z from "zod";

const { default: connectToDB } = require("@/configs/db");

const createNewTopics = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { name } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const validTopic = topicSchema.parse({
      name,
    });
    if (!validTopic) {
      return res.status(400).json({ message: "Invalid Category Data!" });
    }
    // Generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // Check if topic already exists
    const existingTopic = await topicModel.findOne({ slug });
    if (existingTopic) {
      return res.status(201).json({
        success: true,
        data: existingTopic,
        message: "Topic created successfully",
      });
    }
    const newTopic = await topicModel.create({
      name: name.trim(),
      slug,
    });
    if (!newTopic) {
      return res.status(400).json({ message: "Created Topic Has Problem!" });
    }
    return res.status(201).json({
      success: true,
      data: newTopic,
      message: "Topic created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const getAllTopic = async (req, res) => {
  try {
    // const { token } = req.cookies;
    const { search, limit = 10 } = req.query;

    let query = {};
    // if (!token) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // const validToken = verifyToken(token);
    // if (!validToken) {
    //   return res.status(401).json({ message: "Invalid Token" });
    // }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const topics = await topicModel
      .find(query)
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .select("name slug");

    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "GET") {
    await getAllTopic(req, res);
  }
  if (req.method === "POST") {
    await createNewTopics(req, res);
  }
};

export default handler;
