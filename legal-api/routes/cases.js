import express from "express";
import fetchCases from "../utils/fetchCases.js";

const router = express.Router();

// Route to fetch legal cases
router.get("/", async (req, res) => {
  const search = req.query.search || "contract";

  try {
    const cases = await fetchCases(search);
    res.json(cases);
  } catch (err) {
    console.error("Error in /api/cases route:", err);
    res.status(500).json({ error: "Failed to fetch case data" });
  }
});

export default router;