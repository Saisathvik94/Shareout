import { OTP } from "../services/otp.js";
import { client } from '../services/redis.js'
import { Router } from "express";

const router = Router()

router.post("/", async (req, res) => {
  try{
    const key = OTP()
    await client.set(key, req.body.text, "EX", 120);
    res.json({ success: true, otp : key });

  }catch(error){
    console.log("Redis error", error)
  }
});
export default router;

