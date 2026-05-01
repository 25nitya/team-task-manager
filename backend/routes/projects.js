const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
// We will create this 'protect' middleware next to verify tokens
const { protect, authorize } = require('../middleware/authMiddleware');

// CREATE PROJECT (Admin Only)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const newProject = new Project({
            name,
            description,
            members,
            admin: req.user.id // Taken from the JWT token
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET ALL PROJECTS (Visible to logged in users)
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find().populate('admin', 'name').populate('members', 'name');
        res.json(projects);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET PROJECT BY ID
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('admin', 'name').populate('members', 'name');
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// UPDATE PROJECT (Admin Only)
router.put('/:id', protect, authorize('Admin'), async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, description, members },
            { new: true }
        ).populate('admin', 'name').populate('members', 'name');
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE PROJECT (Admin Only)
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        res.json({ msg: 'Project deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;