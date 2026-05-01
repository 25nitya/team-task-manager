const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- DASHBOARD STATS (Must be above /:id routes to avoid ID conflicts) ---
router.get('/dashboard/stats', protect, async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'Done' });
        const overdue = await Task.countDocuments({ 
            dueDate: { $lt: new Date() }, 
            status: { $ne: 'Done' } 
        });
        
        res.json({ total, completed, overdue });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- CREATE TASK (Admin Only) ---
router.post('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const { title, description, project, assignedTo, dueDate } = req.body;
        const task = new Task({ title, description, project, assignedTo, dueDate });
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- GET ALL TASKS ---
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('project', 'name')
            .populate('assignedTo', 'name');
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- UPDATE TASK STATUS (Admin or Member) ---
router.patch('/:id', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- DELETE TASK (Admin Only) ---
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;