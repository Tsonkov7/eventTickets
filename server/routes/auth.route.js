import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../db/models/user.model.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import AuthService from "../services/auth.service.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Username, password, and email are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({
      username,
      password,
      email,
      verificationToken,
    });
    await newUser.save();

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification
    await user.save();
    return res.redirect(`http://localhost:5173/verification`);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during verification." });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await AuthService.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    if (!JWT_SECRET) {
      // Do not tell potential attackers that the JWT_SECRET is not configured :)
      return res
        .status(500)
        .json({ message: "Problem with the Authentication Service" });
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
