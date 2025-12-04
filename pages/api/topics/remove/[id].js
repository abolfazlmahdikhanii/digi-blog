import { verifyToken } from "@/lib/utils";
import topicModel from "@/models/topics";
import { isValidObjectId } from "mongoose";

const { default: connectToDB } = require("@/configs/db");

const removeTopic = async (req, res) => {
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
      return res.status(404).json({ message: "Not Found Story!" });
    }

    const topics = await topicModel.findOneAndDelete({ _id: id });

    if (!topics) {
      return res.status(404).json({ message: "Failed Remove Story!" });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully Remove",
    });
  } catch (error) {
 
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "DELETE") {
    await removeTopic(req, res);
  }
};

export default handler;
