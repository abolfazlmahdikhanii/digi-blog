import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import followModel from "@/models/follows";

import usersModel from "@/models/users";

const getFollowing = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await usersModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }

    const following = await followModel
      .find({
        follower: user._id,
      })
      .populate("following")
      .lean();

    if (!following) {
      return res.status(400).json({
        message: "Get Following Has Problem!",
        following: [],
      });
    }

    return res.status(200).json({
      message: "Get Following Successfully :)",
      following,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
const handler = async (req, res) => {
  await connectToDB();
  if (req.method !== "GET") return res.status(405).end();
  await getFollowing(req, res);
};

export default handler;
