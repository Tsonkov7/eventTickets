import express from "express";

import dataRoute from "./data.route.js";
import authRoute from "./auth.route.js";

const router = express.Router();

router.use("/data", dataRoute);

router.use("/auth", authRoute);

export default router;
