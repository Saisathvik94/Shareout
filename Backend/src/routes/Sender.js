import { OTP } from "../services/otp.js";
import { client } from '../services/redis.js';
import { sendRateLimiter } from '../middlewares/rateLimit.js'
import { Router } from "express";

const router = Router()

router.post("/", sendRateLimiter , async (req, res) => {
  try{
    const type = req.body.type // Only for Text for files use Multer to get FormData in backend
    const key = OTP()
    if(type === "text"){
      const value = req.body.text;
      await client.set(key, value, { EX: 120 });
      res.json({ success: true, otp : key });
    }
    // Store files & images in S3

  }catch(error){
    console.log("Redis error", error)
  }
});
export default router;

