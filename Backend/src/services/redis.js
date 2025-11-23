import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis server");
});

// Prevent duplicate connections
if (!client.isOpen) {
  await client.connect();
}

export { client };
