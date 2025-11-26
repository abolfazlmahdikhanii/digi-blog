// @/service/mail-service.js
import { createTransport } from "nodemailer";

const getTransporter = () => {
  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    throw new Error("Zoho email credentials not configured");
  }

  return createTransport({
    host: "smtp.zoho.com",
    port: 587,                // ← CHANGE TO 587 (this is the key!)
    secure: false,            // ← Must be false when using port 587
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD, // Must be Zoho App Password!
    },
    tls: {
      ciphers: "SSLv3",
      // rejectUnauthorized: false, // Only if you're having cert issues (rare)
    },
    // Optional: Increase timeout (helps on cold starts)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

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