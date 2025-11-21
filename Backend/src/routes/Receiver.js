import { client } from '../services/redis.js'
import { Router } from "express";

const router = Router()

router.post("/", async (req, res) => {
  try {
    const { otp } = req.body;

    const data = await client.get(otp);
    if (!data) {
      return res.json({ success: false, message: "Invalid or Expired OTP" });
    }

    await client.del(otp); // delete once used

    res.json({ success: true, message: "OTP Verified", data });

  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

export default router;
