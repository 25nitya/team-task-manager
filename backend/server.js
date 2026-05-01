require('dotenv').config(); // MUST BE AT THE TOP
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Database Connection ---
// This now works because the line at the top loaded the URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🚀 Database Connected!"))
    .catch(err => console.log("❌ DB Error:", err));

// --- Routes ---
app.get('/', (req, res) => res.send("API is Live"));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));