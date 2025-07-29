import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/data", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, process.env.DB_FILE);
    const data = await fs.readFile(dataPath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: `Could not read ${process.env.DB_FILE}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
