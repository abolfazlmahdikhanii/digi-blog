// @/service/mail-service.js
import axios from "axios";

const sendMail = async (options) => {
  try {
    if (!options?.to || !options?.passcode) {
      throw new Error("Missing required email fields (to, passcode)");
    }

    // Calculate expiration time if not provided
    const expirationTime =
      options.time ||
      (() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        return now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      })();

    const templateParams = {
      to_email: options.to,
      passcode: options.passcode,
      time: expirationTime,
    };

    console.log("Sending email with params:", {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      to: options.to,
      passcode: options.passcode,
      time: expirationTime,
    });

    const url = "https://api.emailjs.com/api/v1.0/email/send";

    const data = {
      service_id:process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params:templateParams
    };

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Email sent successfully:", response.data);

    return {
      success: true,
      messageId: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Failed to send email:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    return {
      success: false,
      error: error.response?.data || error.message || "Unknown error",
    };
  }
};

export { sendMail };
