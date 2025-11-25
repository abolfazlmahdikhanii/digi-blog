import { createTransport } from "nodemailer";

const getTransporter = () => {
  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    throw new Error(
      "Zoho email credentials not configured in environment variables"
    );
  }

  return createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });
};

const sendMail = async (options) => {
  try {
    // Validate inputs
    if (!options?.to || !options?.subject || !options?.text) {
      throw new Error("Missing required email fields (to, subject, or text)");
    }

    const transporter = getTransporter();
    const mailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<p>${options.text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
   console.log(error);

    throw new Error(`Email sending failed: ${error.message}`);
  }
};
export {sendMail}