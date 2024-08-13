import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('https://fapi.binance.com/fapi/v1/ticker/24h', (req, res) => {
    console.log()
})