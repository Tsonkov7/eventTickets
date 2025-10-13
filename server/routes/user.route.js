import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/profile", protect, async (req, res) => {
  const user = req.user;
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;
