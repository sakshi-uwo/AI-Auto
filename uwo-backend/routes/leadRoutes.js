import express from 'express';
import Lead from '../models/Lead.js';
import { getDashboardStats } from '../utils/dashboardUtils.js';
import { calculateLeadScore } from '../utils/leadScoring.js';

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
        console.log('📥 GET /api/lead - Fetching all leads...');
        const leads = await Lead.find()
            .populate('user', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        console.log(`✅ Found ${leads.length} leads.`);
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
        const { user, source, name, email, phone, status, projectInterest, isSimulated } = req.body;

        if (isSimulated) {
            if (process.env.NODE_ENV === 'production') {
                return res.status(403).json({ message: 'Simulation not allowed in production' });
            }

            // Verify token for admin role
            let isAdmin = false;
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                try {
                    const jwt = (await import('jsonwebtoken')).default;
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const User = (await import('../models/User.js')).default;
                    const currentUser = await User.findById(decoded.id);
                    if (currentUser && currentUser.role === 'admin') isAdmin = true;
                } catch (e) {
                    console.error('Simulation Auth Error:', e.message);
                }
            }

            if (!isAdmin) {
                return res.status(403).json({ message: 'Only admins can simulate leads' });
            }
        }

        if (!source) return res.status(400).json({ message: 'Source missing' });

        // Build temporary object to calculate initial score
        const tempLead = {
            isSimulated,
            engagementSignals: req.body.engagementSignals || {},
            lastEngagementAt: Date.now()
        };
        const { score, temperature } = calculateLeadScore(tempLead);

        const newLead = new Lead({
            user: user || null,
            name,
            email,
            phone,
            source,
            isSimulated: isSimulated || false,
            status: status || 'New',
            projectInterest,
            leadScore: score,
            leadTemperature: temperature,
            engagementSignals: req.body.engagementSignals || {},
            lastEngagementAt: Date.now()
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
        console.log(`📥 PATCH /api/lead/${req.params.id} - Updating lead...`);

        const existingLead = await Lead.findById(req.params.id);
        if (!existingLead) return res.status(404).json({ message: 'Lead not found' });

        // Merge updates into the document
        Object.assign(existingLead, req.body);

        // Update engagement time if signals are modified explicitly
        if (req.body.engagementSignals) {
            existingLead.lastEngagementAt = Date.now();
        }

        // Recalculate CRM Temperature & Score
        const { score, temperature } = calculateLeadScore(existingLead);
        existingLead.leadScore = score;
        existingLead.leadTemperature = temperature;

        await existingLead.save();

        const lead = await Lead.findById(existingLead._id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

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
