import connectToDB from "@/configs/db";
import { generateToken, verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";
import saveModel from "@/models/save";
import usersModel from "@/models/users";
import userSchema from "@/validations/user";
import { serialize } from "cookie";
import { isValidObjectId } from "mongoose";
import z from "zod";
const updateHandler = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { id } = req.query;
    const { name, topics } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(401).json({ message: "Not Found!" });
    }
    // Check authentication
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    // Find current user
    const currentUser = await usersModel.findOne({ email: validToken.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    if (name) {
      if (!name.trim())
        return res.status(402).json({ message: "Name is Empty!" });
      const isExistName = await usersModel.findOne({
        name: name.trim(),
        _id: { $ne: currentUser._id },
      });
      if (isExistName) {
        return res.status(400).json({ message: "Try other Name" });
      }
      const user = await usersModel.findOneAndUpdate(
        { _id: currentUser._id },
        {
          name,
        }
      );
      if (!user) {
        return res.status(400).json({
          message: "User Failed updated !",
        });
      }

      return res.status(200).json({
        message: "User full name updated successfully!",
      });
    } else if (topics) {
      if (!Array.isArray(topics)) {
        return res.status(400).json({
          message: "Topics must be an array!",
        });
      }
      if (topics.length < 3)
        return res
          .status(402)
          .json({ message: "Topic length is less then 3!" });
      const topic = await usersModel.findOneAndUpdate(
        { _id: currentUser._id },
        {
          interests: topics,
          isProfileComplete: true,
        }
      );
      if (!topic) {
        return res.status(400).json({
          message: "User Failed updated !",
        });
      }

      return res.status(200).json({
        message: "User topic updated successfully!",
      });
    }
  } catch (error) {
    console.error("Update handler error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "PUT") {
    await updateHandler(req, res);
  } else return res.status(405).end();
};

export default handler;
