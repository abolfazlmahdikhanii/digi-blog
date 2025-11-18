import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";

import usersModel from "@/models/users";

const getFollower = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await usersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const follower = await followModel.find({
      following: user._id,
    }).populate("follower").lean();


    return res.status(200).json({
      message: "Get Following Successfully :)",
      follower,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method !== "GET") return res.status(405).end();
  await getFollower(req, res);
};

export default handler;
