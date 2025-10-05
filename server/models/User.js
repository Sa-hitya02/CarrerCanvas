const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    professionalTitle: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    skills: [{
        name: String,
        level: String,
    }],
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        githubUrl: String,
    }],
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },

    },
    profileCompletion: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
