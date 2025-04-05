import express from "express";
import { fetchCases, fetchCourts } from "../utils/fetchCases.js";

const router = express.Router();

// Route to fetch legal cases
router.get("/", async (req, res) => {
  const search = req.query.search || "contract";
  console.log(`\x1b[36m[SEARCH LOG]\x1b[0m Received search term: ${search}`);

  try {
    const cases = await fetchCases(search);
    res.json(cases);
  } catch (err) {
    console.error("Error in /api/cases route:", err);
    res.status(500).json({ error: "Failed to fetch case data" });
  }
});

// Route to fetch courts
router.get("/courts", async (req, res) => {
  console.log("[COURTS LOG] Fetching courts data");

  try {
    const courts = await fetchCourts();
    res.json(courts);
  } catch (err) {
    console.error("Error in /api/cases/courts route:", err);
    res.status(500).json({ error: "Failed to fetch court data" });
  }
});

export default router;