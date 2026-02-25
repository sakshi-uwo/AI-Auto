import express from 'express';
import Lead from '../models/Lead.js';
import { getDashboardStats } from '../utils/dashboardUtils.js';

const router = express.Router();

// Helper to emit dashboard updates
const emitDashboardUpdate = async (app) => {
    const io = app.get('io');
    if (io) {
        const stats = await getDashboardStats();
        io.emit('dashboard-update', stats);
        console.log('📢 Real-time event emitted: dashboard-update');
    }
};

// @route   GET /api/lead
// @desc    Get all leads with populated user data
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('user', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        console.error('❌ Error fetching leads:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/lead
// @desc    Create a new lead with flexible fields and emit socket event
router.post('/', async (req, res) => {
    try {
        const { user, source, name, email, phone, status, projectInterest } = req.body;

        if (!source) return res.status(400).json({ message: 'Source missing' });

        const newLead = new Lead({
            user: user || null,
            name,
            email,
            phone,
            source,
            status: status || 'New',
            projectInterest
        });
        const saved = await newLead.save();

        const populatedLead = await Lead.findById(saved._id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        const io = req.app.get('io');
        if (io) {
            io.emit('lead-added', populatedLead);
            console.log('📢 Real-time event emitted: lead-added', populatedLead.name || 'Anonymous');
        }

        // Also emit dashboard update
        await emitDashboardUpdate(req.app);

        res.status(201).json(populatedLead);
    } catch (err) {
        console.error('❌ Error saving lead:', err.stack || err);
        res.status(500).json({ error: err.message });
    }
});

// @route   PATCH /api/lead/:id
// @desc    Update lead status
router.patch('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('lead-updated', lead);
        }

        // Also emit dashboard update
        await emitDashboardUpdate(req.app);

        res.json(lead);
    } catch (err) {
        console.error('❌ Error updating lead:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
