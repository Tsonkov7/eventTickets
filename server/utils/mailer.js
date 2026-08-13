import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (userEmail, token) => {
  const verificationUrl = `${SERVER_URL}/auth/verify/${token}`;

  const mailOptions = {
    from: `"RavePass" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify your RavePass account",
    html: `
      <h2>Welcome to RavePass</h2>
      <p>Thanks for registering. Click the link below to verify your email:</p>
      <a href="${verificationUrl}" target="_blank">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (userEmail, order) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.quantity}x ${item.ticketType} — ${item.eventName} ($${item.price * item.quantity})</li>`
    )
    .join("");

  const mailOptions = {
    from: `"RavePass" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your RavePass order confirmation",
    html: `
      <h2>Order confirmed!</h2>
      <p>Thanks for your purchase. Here are your tickets:</p>
      <ul>${itemsList}</ul>
      <p><strong>Total: $${order.totalAmount.toFixed(2)}</strong></p>
      <p>View your order history at <a href="${FRONTEND_URL}/profile">${FRONTEND_URL}/profile</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
