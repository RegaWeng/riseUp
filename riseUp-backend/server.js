const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const jobRoutes = require('./routes/jobs');
const savedPostsRoutes = require('./routes/savedPosts');
const videosRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/savedPosts', savedPostsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/test', (req, res) => {
  res.json({ message: "Backend server is working!" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
