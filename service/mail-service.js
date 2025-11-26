import emailjs from "@emailjs/browser";

/**
 * Send email using EmailJS (Server-side compatible)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.passcode - OTP code to send
 * @param {string} options.time - Expiration time for the OTP (optional)
 */
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

    // Prepare template parameters matching your EmailJS template
    const templateParams = {
      to_email: options.to, // Recipient email
      passcode: options.passcode, // OTP code
      time: expirationTime, // Expiration time
    };

    // Send email using EmailJS REST API
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
      }
    );

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
