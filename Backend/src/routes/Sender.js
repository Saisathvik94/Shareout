import { OTP } from "../services/otp.js";
import { Router } from "express";

const router = Router()

function sendOtp(req, res) {
    const code = OTP();  
    res.json({ otp: code });
}

router.post("/send", (req, res) => {
    console.log("Received text:", req.body.text);
    res.json({ success: true });
});
export default router;

