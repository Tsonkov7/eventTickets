import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("Attempting to use Email User:", process.env.EMAIL_USER);
console.log("Is Email Pass loaded?:", process.env.EMAIL_PASS ? "Yes" : "NO!");
// Create a "transporter" object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (userEmail, token) => {
  // IMPORTANT: Use your actual frontend URL here
  const verificationUrl = `http://localhost:3000/auth/verify/${token}`;

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Please Verify Your Email Address",
    html: `
      <h2>Email Verification</h2>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
