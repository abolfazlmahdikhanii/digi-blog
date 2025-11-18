import { generateOTP } from "@/lib/utils";
import { z, safeParse } from "zod";
import { authSchema } from "@/validations/auth";
import connectToDB from "@/configs/db";
import otpModel from "@/models/userOtp";
import { sendMail } from "@/service/mail-service";

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
    const { email } = req.body;

    const validEmail = authSchema.parse({ email: `${email}` });
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
