import connectToDB from "@/configs/db";
import otpModel from "@/models/userOtp";
import { authSchema } from "@/validations/auth";
import { z } from "zod";

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await connectToDB();
  try {
    const { email, otp } = req.body;
    const validEmail = authSchema.parse({ email: email });
    // check otp filed has fill
    if (!otp) return res.status(400).json({ message: "invalid otp!" });
    // check otp is verify
    const userOtp = await otpModel.findOne({ email: validEmail.email });
    if (!userOtp) {
      return res.status(404).json({ message: "not found otp for this email!" });
    }
    // Check if OTP is expired
    if (userOtp.expiresAt && new Date() > new Date(userOtp.expiresAt)) {
      await otpModel.findOneAndDelete({ email: validEmail });
      return res.status(410).json({ message: "OTP has expired" });
    }
    if (userOtp.blockedUntil !== null) {
      if (new Date(userOtp.blockedUntil) > new Date()) {
        return res.status(429).json({
          message: "max used otp disable for min",
        });
      } else if (new Date(userOtp.blockedUntil) <= new Date()) {
        await otpModel.findOneAndDelete({ email: validEmail });
        return res.status(410).json({ message: "OTP has expired" });
      }
    }
    if (userOtp.used >= 3) {
      await otpModel.findOneAndUpdate(
        { email: validEmail.email },
        {
          blockedUntil: new Date(Date.now() + 1 * 60 * 1000),
        }
      );

      return res.status(429).json({ message: "max used otp disable for min!" });
    }
    const otpVerify = await otpModel.findOne({
      email: validEmail.email,
      otp: Number(otp),
    });
    if (!otpVerify) {
      await otpModel.findOneAndUpdate(
        { email: validEmail.email },
        {
          $inc: { used: 1 },
        }
      );
      return res.status(401).json({ message: "invalid otp!" });
    }
    await otpModel.findOneAndDelete({ email: validEmail.email });
    return res.status(200).json({ message: "otp is verified" });
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

export default handler;
