import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";

const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  await connectToDB();
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const validToken = verifyToken(token);
    if (!validToken) return res.status(401).json({ message: "Invalid Token" });

    const user = await usersModel.findOne({ email: validToken.email }).lean();
    if (!user) return res.status(404).json({ message: "User Not Found!" });

    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
export default handler;
