import express from "express";
import Event from "../db/models/event.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find({}).lean();
    return res.json(events);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not fetch events from database" });
  }
});

export default router;
