const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Owner of the project
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);