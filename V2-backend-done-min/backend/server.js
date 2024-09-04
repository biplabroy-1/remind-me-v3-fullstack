// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scheduleRoutes = require('./routes/scheduleRoutes.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error('Could not connect to MongoDB:', err));

// Use schedule routes
app.use('/api', scheduleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});