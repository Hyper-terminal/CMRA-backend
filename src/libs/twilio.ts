import { parentPort, workerData } from "worker_threads";
import twilio from "twilio";

const sendOtp = async (phone: number, otp: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID; // Ensure environment variables are accessible
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      to: "+91" + phone,
      from: process.env.TWILIO_PHONE,
      body: `Cmra testing otp: ${otp}`,
    });
    if (parentPort) {
      parentPort.postMessage(`OTP sent successfully: ${message.sid}`);
    } else {
      console.log(`OTP sent successfully: ${message.sid}`);
    }
  } catch (error: any) {
    if (parentPort) {
      parentPort.postMessage(`Failed to send OTP: ${error.message}`);
    }
  }
};

sendOtp(workerData.phone, workerData.otp);
