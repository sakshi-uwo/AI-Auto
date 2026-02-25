import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// @route   GET /api/expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        console.error('❌ Error fetching expenses:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/expenses
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const saved = await newExpense.save();

        const io = req.app.get('io');
        if (io) io.emit('expense-added', saved);

        res.status(201).json(saved);
    } catch (err) {
        console.error('❌ Error saving expense:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
