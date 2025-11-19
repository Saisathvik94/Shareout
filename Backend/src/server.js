import express from 'express'
import senderRouter from "./routes/Sender.js";
import cors from "cors";
const app = express()
const port = 3000

app.use(cors({origin: "http://localhost:5173"}))
app.use(express.json());

app.get('/', (req, res) => {
    const data = {
        message: "Hello from ShareOut",
        timestamp: new Date().toISOString()
    }
    res.json(data)
})

app.use('/api', senderRouter);
// app.get('api/receive/', receiver);

app.listen(port, ()=>{
    console.log(`Server Running at http://localhost:${port}`)
})