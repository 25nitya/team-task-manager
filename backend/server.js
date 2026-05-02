const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Load Environment Variables correctly
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🚀 Database Connected!"))
    .catch(err => console.log("❌ DB Error:", err));

// 4. Routes 
// This is where you write the "Health Check" route
app.get('/', (req, res) => {
    res.send("Server is ready and Database is connected!");
});

// Your API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


// 5. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

