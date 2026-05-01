const express = require('express');
const router = express.Router(); 
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER USER ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        // 2. Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user
        user = new User({ name, email, password: hashedPassword, role: role || 'Member' });
        await user.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error("Register Error:", err.message); // This shows in your VS Code Terminal
        res.status(500).send("Server Error");
    }
});

// --- LOGIN USER ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find User
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // 3. Create JWT Token
        // Ensure JWT_SECRET is in your .env file!
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send("Server Error");
    }
});

// --- GET ALL USERS ---
router.get('/users', protect, async (req, res) => {
    try {
        const users = await User.find().select('name email role');
        res.json(users);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;