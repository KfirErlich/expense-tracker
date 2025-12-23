import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './config/database'
import  budgetRoutes from './routes/budget.routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.connect()

app.use('/api/budget', budgetRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


