import { verifyToken } from "@/lib/utils";
import categorySchema from "@/validations/categories";
import z from "zod";

const { default: connectToDB } = require("@/configs/db");
const { default: categoryModel } = require("@/models/category");
const createNewCategory = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { name, slug, icon } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const validCategory = categorySchema.parse({
      name,
      slug,
      icon,
    });
    if (!validCategory) {
      return res.status(400).json({ message: "Invalid Category Data!" });
    }

    const newCategory = await categoryModel.create({
      name: validCategory.name,
      slug: validCategory.slug,
      icon: validCategory.icon,
    });
    if (!newCategory) {
      return res.status(400).json({ message: "Created Category Has Problem!" });
    }
    return res.status(200).json({ message: "Created Category Successfully:)" });
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
    await getAllCategories(req, res);
  }
  if (req.method === "POST") {
    await createNewCategory(req, res);
  }
};

export default handler;
