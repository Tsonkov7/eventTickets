import express from "express";

import dataRoute from "./data.route.js";

const router = express.Router();

router.use("/data", dataRoute);

export default router;
