import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('assignedTo', 'name email role');
        res.json(projects);
    } catch (err) {
        console.error('❌ Error fetching projects:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('assignedTo', 'name email role');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        console.error('❌ Error fetching project:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects
// @desc    Create a new project and emit socket event
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedTo, status, totalUnits, soldUnits, budget, spent, progress } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide project title' });
        }

        const newProject = new Project({
            title,
            description,
            assignedTo,
            status: status || 'In Progress',
            totalUnits: totalUnits || 0,
            soldUnits: soldUnits || 0,
            budget: budget || '$0',
            spent: spent || '$0',
            progress: progress || 0
        });

        const savedProject = await newProject.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('newProject', savedProject);
            console.log('📢 Real-time event emitted: newProject', savedProject._id);
        }

        res.status(201).json(savedProject);
    } catch (err) {
        console.error('❌ Error saving project:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/projects/:id
// @desc    Update a project and emit socket event
router.patch('/:id', async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('assignedTo', 'name email role');

        if (!updated) return res.status(404).json({ message: 'Project not found' });

        const io = req.app.get('io');
        if (io) {
            io.emit('projectUpdated', updated);
            console.log('📢 Real-time event emitted: projectUpdated', updated._id);
        }

        res.json(updated);
    } catch (err) {
        console.error('❌ Error updating project:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
