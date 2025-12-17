# 🚀 Shareout 
**Instantly share text, files, and images using OTP fast, secure, and lightweight.**

ShareOut is a simple and powerful tool that lets users share text, and soon files & images, instantly through a one-time password (OTP). Built for speed and simplicity.

## Try it out
**👉 Link:** https://shareout-taupe.vercel.app/

## ✨ Features

### 🔐 OTP-Based Secure Sharing

- Share anything using a one-time password.

- Each OTP is mapped to a Redis key and expires automatically.

### ⚡ Instant Text Sharing

- Send text instantly through a simple UI.

### 🖼️ File & Media Sharing 

- Files/images upload to supabase bucket → URL stored in Redis.

- Retrieved using OTP.

### ⏳ Auto-Expiring Data

- Redis TTL ensures shared content deletes automatically.

### 🛡️ Rate Limiting

- Protects from spam, abuse, and excessive OTP generation.


## 🛠️ Tech Stack

**Frontend** 

- React

- Tailwind CSS

- Vite

- **Backend**

- Node.js

- Express.js

- Upstash Redis (OTP, text, file URLs)

- supabase (for storing files, images & videos)

- Rate limiting middleware

## 📦 Architecture Overview

**1. Create OTP & Store Data**

- User enters text (or uploads file/media)

- Server generates OTP

- Stores in Redis as:
```
otp:123456 → actual_text_or_file_url
TTL: e.g., 2 minutes
```

**2. Share OTP**

- User sends OTP to anyone.

**3. Retrieve Data**

- Receiver enters OTP

- Backend fetches Redis value

- Data auto-expires after TTL.

## ⚙️ Rate Limiting (express-rate-limit)

**The backend uses express-rate-limit to block:**

- Too many OTP generation requests

- Spam submissions

- Abuse from the same IP
