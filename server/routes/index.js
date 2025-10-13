import express from "express";
import authRoute from "./auth.route.js";
import dataRoute from "./data.route.js";
import userRoute from "./user.route.js";

console.log();

const router = express.Router();

router.use("/auth", authRoute);

router.use("/data", dataRoute);

router.use("/users", userRoute);

export default router;
