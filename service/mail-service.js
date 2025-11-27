// /service/mail-service.js
import { MailerooClient, EmailAddress } from "maileroo-sdk";

const client = new MailerooClient(process.env.MAILEROO_API_KEY,{ timeout: 20000 });

/**
 * options: { to: string, passcode: string, subject?: string, html?: string, plain?: string }
 */
const sendMail = async (options) => {
  try {
    if (!options?.to || !options?.passcode) {
      throw new Error("Missing required email fields (to, passcode)");
    }

    const subject = options.subject || "Your Verification Code";

    // Clean, modern English OTP template
    const html =
      options.html ||
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
    <style>
      /* Inline-friendly, minimal styles */
      body { margin:0; padding:0; background:#f4f6f8; -webkit-font-smoothing:antialiased; }
      .wrapper { width:100%; padding:28px 12px; box-sizing:border-box; }
      .card { max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 30px rgba(2,6,23,0.08); }
      .content { padding:32px 36px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#0f172a; }
      h1 { font-size:20px; margin:0 0 10px; font-weight:600; }
      p.lead { margin:0 0 18px; color:#475569; font-size:15px; line-height:1.5; }
      .otp-box { margin:22px 0; padding:18px; border-radius:10px; background:linear-gradient(180deg,#2563eb 0%,#1d4ed8 100%); text-align:center; }
      .otp-label { margin:0; color:rgba(224,231,255,0.95); font-size:13px; }
      .otp-code { margin:8px 0 0; font-size:36px; font-weight:700; letter-spacing:6px; color:#fff; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; }
      .note { margin:16px 0 0; color:#64748b; font-size:13px; line-height:1.4; }
      .footer { background:#f8fafc; padding:14px 20px; text-align:center; font-size:12px; color:#94a3b8; }
      .logo { display:inline-block; vertical-align:middle; height:36px; }
      @media (max-width:420px) {
        .content { padding:20px; }
        .otp-code { font-size:28px; letter-spacing:4px; }
      }
      /* Button style (optional) */
      .btn { display:inline-block; margin-top:14px; padding:10px 18px; border-radius:8px; background:#0b63ff; color:#fff; text-decoration:none; font-weight:600; }
    </style>
  </head>
  <body>
    <div class="wrapper" role="article" aria-roledescription="email">
      <div class="card" role="presentation">
        <div class="content">
       

          <h1>Verification Code</h1>
          <p class="lead">Enter the code below in the app or website to confirm your identity.</p>

          <div class="otp-box" role="region" aria-label="One-time password">
            <div class="otp-label">Your OTP</div>
            <div class="otp-code" aria-live="polite">${options.passcode}</div>
          </div>

          <p class="note">If you did not request this code, please ignore this email. Do not share this code with anyone.</p>

         
        </div>

        <div class="footer">© ${new Date().getFullYear()} Digiblog. All rights reserved.</div>
      </div>
    </div>
  </body>
</html>`;

    const plain =
      options.plain ||
      `Your verification code is: ${options.passcode}

Enter the code in the app or website to verify your identity.
If you did not request this code, please ignore this message.
© ${new Date().getFullYear()} Digiblog`;

    const from = new EmailAddress(process.env.MAILEROO_FROM, "Digiblog");
    const to = [new EmailAddress(options.to)];

    console.log("Sending OTP email (Maileroo) to:", options.to);

    const referenceId = await client.sendBasicEmail({
      from,
      to,
      subject,
      html,
      plain,
    });

    console.log("Email sent successfully, reference ID:", referenceId);

   if(referenceId){
     return {
      success: true,
      messageId: referenceId,
    };
   }
   else{
     return {
      success: false,
      messageId: "error",
    };
   }
  } catch (error) {
    console.error("Failed to send OTP email (Maileroo):", {
      message: error.message,
      details: error?.response,
    });

    return {
      success: false,
      error: error?.response || error.message || "Unknown error",
    };
  }
};

export { sendMail };
