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
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
app.use(express.json());

// Mount Routes
app.use('/api/students', crudRoutes);
app.use('/api/chat', aiRoutes);

// Health check endpoint
app.get("/",(req, res)=>{
  res.send('  <h1 style="color:white; font-family:Arial, sans-serif; font-size:48px; background:rgba(255,255,255,0.2); padding:20px 40px; border-radius:15px; box-shadow:0 8px 20px rgba(0,0,0,0.2);"> Hi!</h1>')
})
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
