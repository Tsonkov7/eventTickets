import express from "express";
import Stripe from "stripe";
import { protect } from "../middlewares/authMiddleware.js";
import {
  validateAndPriceCartItems,
  fulfillOrder,
} from "../services/order.service.js";
import { sendOrderConfirmationEmail } from "../utils/mailer.js";

const router = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);

router.post("/create-payment-intent", protect, async (req, res) => {
  const { items } = req.body;

  try {
    const { pricedItems, totalAmount } = await validateAndPriceCartItems(items);

    if (totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(pricedItems),
        totalAmount: totalAmount.toString(),
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/confirm", protect, async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: "Payment intent ID is required" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment has not succeeded" });
    }

    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized payment confirmation" });
    }

    const pricedItems = JSON.parse(paymentIntent.metadata.items);
    const totalAmount = parseFloat(paymentIntent.metadata.totalAmount);

    const order = await fulfillOrder(
      req.user._id,
      paymentIntentId,
      pricedItems,
      totalAmount
    );

    await sendOrderConfirmationEmail(req.user.email, order);

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
