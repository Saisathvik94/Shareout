import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now()
    });
  } catch {
    res.status(500).json({ status: "error" });
  }
});

export default router;
