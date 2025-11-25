import connectToDB from "@/configs/db";
const crypto = require("crypto");
import { generateRefreshToken, generateToken, splitMail } from "@/lib/utils";
import refreshTokenModel from "@/models/refreshToken";
import otpModel from "@/models/userOtp";
import usersModel from "@/models/users";
import { authSchema } from "@/validations/auth";
import { serialize } from "cookie";
import { z } from "zod";

const saveNewUser = async (email) => {
  try {
    const users = await usersModel.find({});
    const user = await usersModel.findOne({ email });
    const rndNumber = crypto.randomInt(1, 20000);
    if (!user) {
      const uniqueUsername = await usersModel.findOne({
        username: splitMail(email),
      });
      if (uniqueUsername) {
        await usersModel.create({
          name: splitMail(email),
          username: `${splitMail(email)}-${rndNumber}`,
          email,
          role: users.length > 0 ? "USER" : "ADMIN",
          profileImage: "",
          bio: "",
          isProfileComplete: false,
          interests: [],
        });
        return { success: true, isNew: true };
      } else {
        await usersModel.create({
          name: splitMail(email),
          username: `${splitMail(email)}`,
          email,
          role: users.length > 0 ? "USER" : "ADMIN",
          profileImage: "",
          bio: "",
          isProfileComplete: false,
          interests: [],
        });
        return { success: true, isNew: true };
      }
    }
    return { success: true, isNew: false };
  } catch (error) {
  
    return { success: true, isNew: false };
  }
};
const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await connectToDB();
  try {
    const { email, otp } = req.body;
    const validEmail = authSchema.parse({ email: email });
    // check otp filed has fill
    if (!otp) return res.status(400).json({ message: "invalid otp!" });
    // check otp is verify
    const userOtp = await otpModel.find({ email: `${validEmail.email}` });

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

    const userResult = await saveNewUser(validEmail.email);

    if (!userResult.success) {
      return res.status(405).json({
        message: "Failed to create user account",
      });
    }
    await otpModel.findOneAndDelete({ email: validEmail.email });
    const token = generateToken({ email: validEmail.email });
    const refreshToken = generateRefreshToken({ email: validEmail.email });

    // Delete old refresh tokens for this user
    await refreshTokenModel.deleteMany({ email: validEmail.email });

    // Save new refresh token to database
    await refreshTokenModel.create({
      email: validEmail.email,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res
      .setHeader("Set-Cookie", [
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24,
        }),
        serialize("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }),
      ])
      .status(200)
      .json({ message: "successfully signin:)" });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ message: "Internal ServerError" });
  }
};

export default handler;
