const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    // ROLE-BASED ACCESS CONTROL (Phase 5 Requirement)
    role: { 
        type: String, 
        enum: ['Admin', 'Member'], 
        default: 'Member' 
    }
}, { timestamps: true });

// Export the Model
module.exports = mongoose.model('User', UserSchema);