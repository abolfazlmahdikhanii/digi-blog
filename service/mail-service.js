// @/service/mail-service.js
import emailjs from '@emailjs/browser';



// Initialize EmailJS with your public key
const initEmailJS = () => {
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error("EmailJS public key not configured");
  }
  
  emailjs.init(EMAILJS_PUBLIC_KEY);
};


 
const sendMail = async (options) => {
  try {
    if (!options?.subject || !options?.text) {
      throw new Error("Missing required email fields");
    }

    // Initialize EmailJS
    initEmailJS();

    // Prepare template parameters
    const templateParams = {
      to_email: options.to,
      subject: options.subject,
      message: options.text,
      html_content: options.html || `<p>${options.text}</p>`,
      ...options.templateParams, // Spread any additional params
    };

    // Send email using EmailJS with your service and template
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log("Email sent successfully:", response);

    return {
      success: true,
      messageId: response.text,
      status: response.status,
    };
  } catch (error) {
    console.error("Failed to send email:", {
      message: error.message || error.text,
      status: error.status,
    });

    return {
      success: false,
      error: error.message || error.text || "Unknown error",
    };
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

//     // Optional: Verify connection (uncomment to debug once)
//     // await transporter.verify();
//     // console.log("SMTP connection verified");

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
