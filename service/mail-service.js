// @/service/mail-service.js
import { createTransport } from "nodemailer";

const getTransporter = () => {
  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    throw new Error("Zoho email credentials not configured");
  }

return createTransport({
  host: "smtp.zoho.eu",           // ← THIS IS THE MAGIC LINE (use .eu, not .com)
  port: 587,
  secure: false,                  // MUST be false on 587
  auth: {
    user: process.env.ZOHO_EMAIL,        // e.g. hello@yourdomain.com
    pass: process.env.ZOHO_PASSWORD,     // ← MUST be 16-char App Password
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  // Critical for Vercel cold starts
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 9000,
});
}
const sendMail = async (options) => {
  try {
    if (!options?.to || !options?.subject || !options?.text) {
      throw new Error("Missing required email fields");
    }

    const transporter = getTransporter();

    // Optional: Verify connection (uncomment to debug once)
    // await transporter.verify();
    // console.log("SMTP connection verified");

    const mailOptions = {
      from: `"Your App Name" <${process.env.ZOHO_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<p>${options.text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
    };
  } catch (error) {
    console.error("Failed to send email:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

export { sendMail };