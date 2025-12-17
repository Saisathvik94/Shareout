import { OTP } from "../services/otp.js";
import { client } from '../services/redis.js';
import { sendRateLimiter } from '../middlewares/rateLimit.js'
import { Router } from "express";
import { supabase } from "../services/supabase.js";
import { upload } from "../middlewares/upload.js";

const router = Router()

router.post("/", sendRateLimiter, upload.single("file"), async (req, res) => {
  try{
    const type = req.body.type; // "file" or "media"
    const file = req.file;       // multer parsed file 
    const key = OTP()
    if(type === "text"){
      const data = req.body.text;
      const payload = {
        type,
        data
      }
      await client.set(`otp:${key}`, JSON.stringify(payload), { EX: 120 });
      return res.json({ success: true, otp : key });
    }
    // Store files & Media in Supabase bucket
    else if(type==="file"){
      if(!file){
        return res.status(400).json({ success: false})
      }
      const filename = `${Date.now()}-${file.originalname}`
      const filepath = `files/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("shareout")
        .upload(filepath, file.buffer, {
          contentType: file.mimetype
        });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicData, error: urlError } = await supabase.storage
      .from("shareout")
      .createSignedUrl(filepath, 120); // 120 sec
      if (urlError) throw urlError;

      const expiresAt =  Date.now() + 120000
      const payload = {
        type,
        url: publicData.signedUrl,
        path: filepath,
        expiresAt: expiresAt,
      }

      await client.set(`otp:${key}`, JSON.stringify(payload), { EX: 120 });
      // Track Expiry for CRON Jobs
      await client.zAdd("otp_expiry", {
        score: expiresAt,
        value: JSON.stringify({
          otp: key,
          path: filepath
        })
      });
      res.json({ success: true, otp:key, url: publicData.publicUrl });
    }
    else if(type==="media"){
      if(!file){
        return res.status(400).json({ success: false})
      }
      const filename = `${Date.now()}-${file.originalname}`
      const filepath = `media/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from("shareout")
        .upload(filepath, file.buffer, {
          contentType: file.mimetype
        });
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicData, error: urlError } = await supabase.storage
      .from("shareout")
      .createSignedUrl(filepath, 120); // 120 sec
      if (urlError) throw urlError;

      const expiresAt =  Date.now() + 120000
      const payload = {
        type,
        url: publicData.signedUrl,
        path: filepath,
        expiresAt: expiresAt,
      }

      await client.set(`otp:${key}`, JSON.stringify(payload), { EX: 120 });
      // Track Expiry for CRON Jobs
      await client.zAdd("otp_expiry", {
        score: expiresAt,
        value: JSON.stringify({
          otp: key,
          path: filepath
        })
      });
      
      res.json({ success: true, otp:key, url: publicData.publicUrl });
    }
    

  }catch(error){
    res.status(500).json({ success: false, error: error.message })
  }
});
export default router;

