import { generateOTP, verifyToken } from "@/lib/utils";
import { z, safeParse } from "zod";
import { authSchema } from "@/validations/auth";
import connectToDB from "@/configs/db";
import otpModel from "@/models/userOtp";
import { sendMail } from "@/service/mail-service";
import usersModel from "@/models/users";

const saveOtp = async (res, email, otp) => {
  try {
    const expireTime = new Date(Date.now() + 2 * 60 * 1000);
    // remove old otp
    const userOtp = await otpModel.findOne({ email });
    let blockedUntil = null;
    if (userOtp && userOtp.attempts === 3) {
      blockedUntil = new Date(Date.now() + 1 * 60 * 1000);
    }
    await otpModel.findOneAndDelete({ email });

    // save new otp
    const newOtp = await otpModel.create({
      email,
      otp,
      expireTime,
      attempts: userOtp ? Number(userOtp.attempts) + 1 : 1,
      blockedUntil: blockedUntil ? blockedUntil : null,
    });
    if (newOtp) {
      res.status(200).json({ message: "generate new otp successfully:)" });
    } else {
      return res.status(400).json({ message: "generate new otp has problem!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal ServerError" });
  }
};

const handler = async (req, res) => {
  if (req.method !== "POST") return;
  await connectToDB();
  try {
    const { token } = req.cookies;
    const { email } = req.body;

    // Check authentication
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validToken = verifyToken(token);
    if (!validToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const validEmail = authSchema.parse({ email: `${email}` });

    // Find the current user making the request
    const currentUser = await usersModel.findOne({ email: validToken.email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email is already used by another user
    const emailExists = await usersModel.findOne({
      email: validEmail.email,
      _id: { $ne: currentUser._id }, // Exclude current user
    });

    if (emailExists) {
      return res.status(409).json({ message: "This email is already in use" });
    }

    // Check if new email is same as current email

    if (currentUser.email === validEmail.email) {
      return res.status(400).json({ message: "This is your current email" });
    }
    // Clean up all expired OTPs for this email
    await otpModel.deleteMany({
      expireTime: { $lt: new Date() }, // Delete all expired OTPs
    });
    // check if block send otp and time passed unblock
    const existing = await otpModel.findOne({ email: validEmail.email });
    if (existing && existing.blockedUntil !== null) {
      if (new Date(existing.blockedUntil) > new Date()) {
        return res.status(429).json({
          message: "Maximum attempts reached. Sending disabled for 2 minutes.",
        });
      } else if (new Date(existing.blockedUntil) <= new Date()) {
        await otpModel.findOneAndUpdate(
          { email: validEmail.email },
          {
            attempts: 0,
            blockedUntil: null,
          }
        );
      }
    }
    const otp = generateOTP();
    await saveOtp(res, validEmail.email, otp);

    const newMail = await sendMail({
      to: validEmail.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    });
    if (newMail) {
      return res.status(200).json({ message: "send mail successfully:)" });
    } else {
      return res.status(400).json({ message: "send mail has problem!" });
    }
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
