import nodemailer from "nodemailer";

export const runtime = "nodejs";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendMail(options) {
  try {
    if (!options?.to || !options?.subject) {
      throw new Error("Missing required fields");
    }

    const info = await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || `<p>${options.text}</p>`,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("MAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}