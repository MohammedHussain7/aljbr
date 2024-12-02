const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const managerRoutes = require('./routes/managerRoute'); // Manager routes
const hierachyRoutes = require('./routes/hierachyRoute'); // Hierarchy routes
const departmentRoutes = require('./routes/departmentRoute'); // Hierarchy routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/organization', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/managers', managerRoutes);
app.use('/api/hierarchy', hierachyRoutes);
app.use('/api/department', departmentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
