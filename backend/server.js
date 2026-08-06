import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import profileRoutes from './routes/profileRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/authRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import learningPathRoutes from './routes/learningPathRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', apiRoutes);
app.use('/api/learning', learningPathRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AI Career Guidance Platform API is running!' });
});

app.get('/api/jobs/test', (req, res) => res.json({ ok: true }));
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

