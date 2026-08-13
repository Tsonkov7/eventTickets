import express from "express";
import authRoute from "./auth.route.js";
import dataRoute from "./data.route.js";
import userRoute from "./user.route.js";
import paymentRoute from "./payment.route.js";
import orderRoute from "./order.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/data", dataRoute);
router.use("/users", userRoute);
router.use("/payments", paymentRoute);
router.use("/orders", orderRoute);

export default router;
