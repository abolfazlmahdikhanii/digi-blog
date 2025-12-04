import connectToDB from "@/configs/db";
import { generateToken, verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";
import usersModel from "@/models/users";
import userSchema from "@/validations/user";
import { serialize } from "cookie";

import z from "zod";
const updateHandler = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { email, username, bio, profileImage, job, name, imgId } = req.body;

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

    // Prepare update object
    const updateFields = {};

    // Check for unique fields (username, email, name)
    if (username) {
      const validUsername = userSchema.parse({ username });
      const usernameExists = await usersModel.findOne({
        username: validUsername.username,
        _id: { $ne: currentUser._id }, // Exclude current user
      });

      if (usernameExists) {
        return res.status(400).json({ message: "Username already taken!" });
      }
      updateFields.username = validUsername.username;
    }

    if (email) {
      const validEmail = userSchema.parse({ email });
      const emailExists = await usersModel.findOne({
        email: validEmail.email,
        _id: { $ne: currentUser._id },
      });

      if (emailExists) {
    
        return res.status(400).json({ message: "Email already taken!" });
      }
      updateFields.email = validEmail.email;
    }

    if (name) {
      const validName = userSchema.parse({ name });
      // If name should be unique, check for duplicates
      const nameExists = await usersModel.findOne({
        name: validName.name,
        _id: { $ne: currentUser._id },
      });

      if (nameExists) {
        return res.status(400).json({ message: "Name already taken!" });
      }
      updateFields.name = validName.name;
    }

    // Add non-unique fields directly
    if (bio) updateFields.bio = bio;
    if (profileImage) updateFields.profileImage = profileImage;
    if (imgId) updateFields.imgId = imgId;
    if (job) updateFields.job = job;

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Perform single update operation
    const updatedUser = await usersModel.findOneAndUpdate(
      { email: validToken.email },
      { $set: updateFields }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Update Failed!" });
    }

    if (email) {
      const token = generateToken({ email: updateFields.email });
      res
        .setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
          })
        )
        .status(200)
        .json({
          message: "Profile updated successfully!",
        });
    } else {
      return res.status(200).json({
        message: "Profile updated successfully!",
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

const getFollow = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { username } = req.query;
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
    const targetUser = await usersModel.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const follow = await followModel.findOne({
      follower: currentUser._id,
      following: targetUser._id,
    });

    return res.status(200).json({
      message: "Get Follow Successfully :)",
      isFollow: follow ? true : false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "PUT") {
    await updateHandler(req, res);
  } else if (req.method === "GET") {
    await getFollow(req, res);
  } else return res.status(405).end();
};

export default handler;
