const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user portfolio (authenticated route)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update basic info
router.put('/basic-info', auth, async (req, res) => {
    try {
        const { 
            professionalTitle, 
            bio, 
            location, 
            yearsOfExperience,
            profilePicture 
        } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { 
                professionalTitle, 
                bio, 
                location, 
                yearsOfExperience: Number(yearsOfExperience),
                profilePicture
            },
            { new: true }
        ).select('-password');

        const completion = calculateProfileCompletion(user);
        user.profileCompletion = completion;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add skill
router.post('/skills', auth, async (req, res) => {
    try {
        const { name, level } = req.body;
        const user = await User.findById(req.userId);
        
        const existingSkillIndex = user.skills.findIndex(skill => skill.name === name);
        
        if (existingSkillIndex > -1) {
            user.skills[existingSkillIndex] = { name, level };
        } else {
            user.skills.push({ name, level });
        }
        
        await user.save();
        res.json(user.skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete skill
router.delete('/skills/:skillId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.skills = user.skills.filter(skill => skill._id.toString() !== req.params.skillId);
        await user.save();
        res.json(user.skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add project
router.post('/projects', auth, async (req, res) => {
    try {
        const { title, description, technologies, githubUrl } = req.body;
        const user = await User.findById(req.userId);
        
        user.projects.push({
            title,
            description,
            technologies: typeof technologies === 'string' ? technologies.split(',').map(tech => tech.trim()) : technologies,
            githubUrl
        });
        
        await user.save();
        res.json(user.projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project
router.delete('/projects/:projectId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.projects = user.projects.filter(project => project._id.toString() !== req.params.projectId);
        await user.save();
        res.json(user.projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update social links
router.put('/social-links', auth, async (req, res) => {
    try {
        const { linkedin, github } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { socialLinks: { linkedin, github } },
            { new: true }
        ).select('-password');
        
        await user.save();
        res.json(user.socialLinks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// IMPORTANT: This route MUST be at the bottom to avoid conflicts
// Get public portfolio by user ID (no authentication required)
router.get('/:userId', async (req, res) => {
    try {
        console.log('Fetching portfolio for userId:', req.params.userId); // Debug log
        const user = await User.findById(req.params.userId).select('-password -email');
        console.log('Found user:', user ? 'Yes' : 'No'); // Debug log
        
        if (!user) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching public portfolio:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function
function calculateProfileCompletion(user) {
    let progress = 0;
    if (user.professionalTitle) progress += 20;
    if (user.bio) progress += 20;
    if (user.location) progress += 10;
    if (user.yearsOfExperience > 0) progress += 10;
    if (user.skills.length > 0) progress += 20;
    if (user.projects.length > 0) progress += 20;
    return progress;
}

module.exports = router;
