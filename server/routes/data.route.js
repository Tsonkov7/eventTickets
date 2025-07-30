import express from "express";
import fs from "fs";
import path from "path";
import getDirname from "../utils/getDirname.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const dataPath = path.join(getDirname(), "..", "db", process.env.DB_FILE);
    const data = fs.readFileSync(dataPath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: `Could not read ${process.env.DB_FILE}` });
  }
});

export default router;
