import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import Order from "../db/models/order.model.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch orders" });
  }
});

export default router;
