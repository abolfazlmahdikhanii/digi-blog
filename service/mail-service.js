import axios from "axios";

/**
 * options: { to: string, passcode: string, subject?: string, html?: string, plain?: string }
 */
const sendMail = async (options) => {
  try {
    if (!options?.to || !options?.passcode) {
      throw new Error("Missing required email fields (to, passcode)");
    }

    const subject = options.subject || "Your Verification Code";

    const html =
      options.html ||
      `<p>Your OTP is: <strong>${options.passcode}</strong></p>`;
    const plain = options.plain || `Your OTP is: ${options.passcode}`;

    const data = {
      from: {
        address: process.env.MAILEROO_FROM,
        display_name: "Digiblog",
      },
      to: [{ address: options.to }],
      subject,
      html,
      plain,
      tracking: true,
    };

    console.log("Sending OTP email (Maileroo) to:", options.to);

    const response = await axios.post(
      "https://smtp.maileroo.com/api/v2/emails",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILEROO_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000, // 20 ثانیه
      }
    );

    console.log(
      "Email sent successfully, reference ID:",
      response.data?.reference_id
    );

    return {
      success: true,
      messageId: response.data?.reference_id,
    };
  } catch (error) {
    console.error("Failed to send OTP email (Maileroo):", {
      message: error.message,
      details: error.response?.data,
    });

    return {
      success: false,
      error: error.response?.data || error.message || "Unknown error",
    };
  }
};

export { sendMail };
