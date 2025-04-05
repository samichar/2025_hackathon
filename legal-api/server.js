import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import casesRouter from "./routes/cases.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use the cases API routes
app.use("/api/cases", casesRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});