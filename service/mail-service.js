import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const maxDuration = 15;

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",

  // IMPORTANT
  port: 587,
  secure: false,

  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },

  // FIX TLS / VERCEL ISSUES
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },

  // FIX IPV6 ISSUES ON VERCEL
  family: 4,

  // FIX SERVERLESS TIMEOUTS
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export async function sendMail(options) {
  try {
    if (!options?.to) {
      throw new Error("Recipient email is required");
    }

    if (!options?.subject) {
      throw new Error("Email subject is required");
    }

    // VERIFY SMTP CONNECTION
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"My App" <${process.env.ZOHO_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || `<p>${options.text || ""}</p>`,
    });

    console.log("EMAIL SENT:", info.messageId);

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