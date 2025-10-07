import express, { Request, Response }   from "express";
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth';
import orders from './routes/orders';
import partners from './routes/partners';
import connectDB from './config/db';

dotenv.config();
connectDB();

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.get('/api/home', (req : Request, res : Response) => {
    res.json({ message: 'Hi from backen' });
})

app.use(cors());
app.use(express.json()); 
app.use("/api/auth", authRoutes);
app.use("/api/orders", orders);
app.use("/api/partners", partners);

app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});

