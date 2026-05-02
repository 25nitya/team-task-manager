const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'To Do', enum: ['To Do', 'Done'] },
    dueDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // RELATIONSHIP: Link to Project
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, 
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);