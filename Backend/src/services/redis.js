import { createClient } from 'redis';

const client = createClient({url: "redis://localhost:6379"});

client.on("error",(err) => {
    console.log("Error from redis")
})

client.on("connect", () =>{
  console.log("Connected to redis server")
})

await client.connect()

export { client };
