import { client } from '../services/redis.js'
import { Router } from "express";

const router = Router()

router.post("/", async (req, res) => {
  try {
    const { otp } = req.body;

    const data = await client.get(`otp:${otp}`)
    if (!data) {
      return res.json({ success: false, message: "Invalid or Expired OTP" });
    }
    const payload = JSON.parse(data)

    if (payload.type === "text") {
      return res.json({ success: true, type: "text", data: payload.data });
    } else if (payload.type === "file" || payload.type === "media") {
      return res.json({ success: true, type: payload.type, url: payload.url });
    } else {
      return res.json({ success: false, message: "Unknown type" });
    }

  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

export default router;
