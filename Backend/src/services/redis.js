import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true
  }
});

client.on("error",(err) => {
    console.log("Error from redis")
})

client.on("connect", () =>{
  console.log("Connected to redis server")
})

await client.connect()

export { client };
