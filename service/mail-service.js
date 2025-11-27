// /service/mail-service.js
import { MailerooClient, EmailAddress } from "maileroo-sdk";
import { NextResponse } from "next/server";

const client = new MailerooClient(process.env.MAILEROO_API_KEY, 20000);

/**
 * options: { to: string, passcode: string, subject?: string, html?: string, plain?: string }
 */
const sendMail = async (options) => {
  try {
    if (!options?.to || !options?.passcode) {
      throw new Error("Missing required email fields (to, passcode)");
    }

    const subject = options.subject || "Your Verification Code";

    // Clean, modern English OTP template
    const html = `<p>Your OTP is: <strong>${options.passcode}</strong></p>`;
    const plain = `Your OTP is: ${options.passcode}`;

    const from = new EmailAddress(process.env.MAILEROO_FROM, "Digiblog");
    const to = [new EmailAddress(options.to)];

    console.log("Sending OTP email (Maileroo) to:", options.to);

    const referenceId = await client.sendBasicEmail({
      from,
      to,
      subject,
      html,
      plain,
    });

    console.log("Email sent successfully, reference ID:", referenceId);
    NextResponse.json({
      messageId: "Email sent successfully, reference ID:",
      referenceId,
    });

    if (referenceId) {
      return {
        success: true,
        messageId: referenceId,
      };
    } else {
      return {
        success: false,
        messageId: "error",
      };
    }
  } catch (error) {
    console.error("Failed to send OTP email (Maileroo):", {
      message: error.message,
      details: error?.response,
    });

    return {
      success: false,
      error: error?.response || error.message || "Unknown error",
    };
  }
};

export { sendMail };
