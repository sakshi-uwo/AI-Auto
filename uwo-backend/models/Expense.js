import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
