import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import crudRoutes from './routes/crudRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/students', crudRoutes);
app.use('/api/chat', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Admin Dashboard API is running.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error: ' + err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
