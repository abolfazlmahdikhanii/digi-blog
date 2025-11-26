import { createTransport } from "nodemailer";

const getTransporter = () => {
  return createTransport({
    service: 'gmail',  // Built-in Gmail config
    auth: {
      user: process.env.GMAIL_USER,       // your-email@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD, // App-specific password
    },
  });
};

const sendMail = async (options) => {
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<p>${options.text}</p>`,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw new Error(`Email failed: ${error.message}`);
  }
};

export { sendMail };





// // @/service/mail-service.js
// import { createTransport } from "nodemailer";

// const getTransporter = () => {
//   if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
//     throw new Error("Zoho email credentials not configured");
//   }

//   return createTransport({
//     service: "zoho",
//     host: "smtp.zoho.com", // ← THIS IS THE MAGIC LINE (use .eu, not .com)
//     port: 465,
//     secure: true, // MUST be false on 587
//     auth: {
//       user: process.env.ZOHO_EMAIL, // e.g. hello@yourdomain.com
//       pass: process.env.ZOHO_PASSWORD, // ← MUST be 16-char App Password
//     },
//     tls: {
//       rejectUnauthorized: true,
//     },
//   });
// };
// const sendMail = async (options) => {
//   try {
//     if (!options?.to || !options?.subject || !options?.text) {
//       throw new Error("Missing required email fields");
//     }

//     const transporter = getTransporter();

   

//     const mailOptions = {
//       from: `"Your App Name" <${process.env.ZOHO_EMAIL}>`,
//       to: options.to,
//       subject: options.subject,
//       text: options.text,
//       html: options.html || `<p>${options.text}</p>`,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", info.messageId);

//     return {
//       success: true,
//       messageId: info.messageId,
//       accepted: info.accepted,
//     };
//   } catch (error) {
//     console.error("Failed to send email:", {
//       message: error.message,
//       code: error.code,
//       response: error.response,
//     });

//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// export { sendMail };



