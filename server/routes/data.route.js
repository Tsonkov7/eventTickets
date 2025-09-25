import express from "express";
import DbService from "../services/db.service.js";
import { DATABASE_COLLECTIONS } from "../constants.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await DbService.getMany(DATABASE_COLLECTIONS.EVENT, {});
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch events from database" });
  }
});

export default router;
