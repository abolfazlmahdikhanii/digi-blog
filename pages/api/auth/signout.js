import { serialize } from "cookie";

const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();

  try {
    res
      .setHeader(
        "Set-Cookie",
        serialize("token", "", {
          path: "/",
          maxAge: 0,
        })
      )
      .status(200)
      .json({ message: "user successfully signout" });
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};
export default handler;
