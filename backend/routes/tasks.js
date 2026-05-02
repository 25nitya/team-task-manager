const express = require('express');
const router = express.Router(); // This line fixes the 'ReferenceError'
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

// --- DASHBOARD STATS ---
router.get('/dashboard/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetching counts with fallbacks to 0
        const total = await Task.countDocuments({ assignedTo: userId }) || 0;
        const completed = await Task.countDocuments({ assignedTo: userId, status: 'Done' }) || 0;
        const overdue = await Task.countDocuments({ 
            assignedTo: userId,
            dueDate: { $lt: new Date() }, 
            status: { $ne: 'Done' } 
        }) || 0;
        
        res.json({ total, completed, overdue });
    } catch (err) {
        console.error("Stats Error:", err.message);
        res.status(500).json({ total: 0, completed: 0, overdue: 0 });
    }
});

// --- CREATE TASK ---
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        if (!title) return res.status(400).json({ msg: 'Title is required' });

        const task = new Task({ 
            title, 
            description, 
            assignedTo: req.user.id, 
            dueDate 
        });

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- GET ALL TASKS ---
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- UPDATE TASK STATUS ---
router.patch('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, assignedTo: req.user.id },
            { status },
            { new: true }
        );

        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- DELETE TASK ---
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.user.id });
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;