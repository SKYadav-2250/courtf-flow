const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const casesRoutes = require('./routes/casesRoutes');
const courtroomsRoutes = require('./routes/courtroomsRoutes');
const judgesRoutes = require('./routes/judgesRoutes');
const lawyersRoutes = require('./routes/lawyersRoutes');
const clerksRoutes = require('./routes/clerkRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/cases', casesRoutes);
app.use('/api/clerks', clerksRoutes);
app.use('/api/courtrooms', courtroomsRoutes);
app.use('/api/judges', judgesRoutes);
app.use('/api/lawyers', lawyersRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
