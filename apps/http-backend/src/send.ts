import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const response = await resend.emails.send({
      from: "Suvidh Portal <noreply@suvidhaportal.com>", // must match your verified domain
      to: to,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}\nIt expires in 15 minutes.`,
    });

    console.log("Email sent:", response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
