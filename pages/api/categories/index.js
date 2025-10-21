import { verifyToken } from "@/lib/utils";

const { default: connectToDB } = require("@/configs/db");
const { default: categoryModel } = require("@/models/categories");

const getAllCategories = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const categories = await categoryModel.find({}).lean();

    return res
      .status(200)
      .json({ message: "Created Post Successfully:)", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  await connectToDB();
  if (req.method === "GET") {
    await getAllCategories(req,res)
  }
};

export default handler