import { createTransport } from "nodemailer";


const getTransporter = () => {
  if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
    throw new Error(
      "Zoho email credentials not configured in environment variables"
    );
  }


  
  const transportOptions = {
    host:  "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    // Add these for better Vercel compatibility
    debug: process.env.NODE_ENV === 'development', // Enable debug in dev
    logger: process.env.NODE_ENV === 'development', // Enable logging in dev
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    socketTimeout: 20000, // 20 seconds
    tls: {
      rejectUnauthorized: false,
    }
  };

  return createTransport(transportOptions);
};

const sendMail = async (options) => {
  try {
    console.log("Starting email send process");
    console.log("Email configuration:", {
      hasEmail: !!process.env.ZOHO_EMAIL,
      hasPassword: !!process.env.ZOHO_PASSWORD,
      smtpHost: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
      smtpPort: process.env.ZOHO_SMTP_PORT || 587,
    });

    // Validate inputs
    if (!options?.to || !options?.subject || !options?.text) {
      throw new Error("Missing required email fields (to, subject, or text)");
    }

    const transporter = getTransporter();
    
    // Verify connection configuration
    try {
      console.log("Verifying SMTP connection...");
      const verification = await transporter.verify();
      console.log("✓ SMTP connection verified:", verification);
    } catch (error) {
      console.error("✗ SMTP verification failed:", error);
      throw new Error(`SMTP verification failed: ${error.message}`);
    }

    const mailOptions = {
      from: `"Your App Name" <${process.env.ZOHO_EMAIL}>`, // Add display name
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<p>${options.text}</p>`,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    console.log(`Sending email to: ${options.to}`);
    console.log("Mail options:", JSON.stringify({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    }, null, 2));

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✓ Email sent successfully:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });

    // Check if email was accepted
    if (info.rejected && info.rejected.length > 0) {
      throw new Error(`Email rejected by server for: ${info.rejected.join(', ')}`);
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response 
    };
  } catch (error) {
    console.error("✗ Email sending failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });

    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export { sendMail };