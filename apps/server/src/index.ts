import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './config/database'
import  budgetRoutes from './routes/budget.routes'
import initializeFirebase from './config/firbase-config'

dotenv.config();

// Initialize Firebase Admin before setting up routes
initializeFirebase();

const app = express();
const PORT = process.env.PORT || 10000;
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


