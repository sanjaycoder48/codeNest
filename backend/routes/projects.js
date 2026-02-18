const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Create Project
router.post('/', auth, async (req, res) => {
    const { title, description, techStack } = req.body;
    try {
        const newProject = new Project({
            title,
            description,
            techStack,
            userId: req.user.id
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get User Projects
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete Project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
