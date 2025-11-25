import express from 'express'
import senderRouter from "./routes/Sender.js";
import receiverRouter from "./routes/Receiver.js"
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express()
const port = process.env.PORT

app.use(cors({origin: "*"}))
app.use(express.json());

app.get('/', (req, res) => {
    const data = {
        message: "Hello from ShareOut",
        timestamp: new Date().toISOString()
    }
    res.json(data)
})

app.use('/api/send', senderRouter);
app.use('/api/receive', receiverRouter);

app.listen(port, ()=>{
    console.log(`Server Running at http://localhost:${port}`)
})