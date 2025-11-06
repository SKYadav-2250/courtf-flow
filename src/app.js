import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import casesRoutes from './routes/casesRoutes.js';
import courtroomsRoutes from './routes/courtroomsRoutes.js';
import judgesRoutes from './routes/judgesRoutes.js';
import lawyersRoutes from './routes/lawyersRoutes.js';
import clerksRoutes from './routes/clerkRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS
app.use(cors({
  origin: "*",        // sabko allow
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use('/api/cases', casesRoutes);
app.use('/api/clerks',  clerksRoutes);
app.use('/api/courtrooms', courtroomsRoutes);
app.use('/api/judges', judgesRoutes);
app.use('/api/lawyers', lawyersRoutes);
app.use('/api/users', authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
