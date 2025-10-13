import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
import "dotenv/config";
import { connect } from "./db/mongo.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  next(); // Pass control to the next function (your router)
});
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connect();
