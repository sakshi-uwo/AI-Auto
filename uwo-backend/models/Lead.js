import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    source: {
        type: String,
        required: true,
        default: 'Direct'
    },
    status: {
        type: String,
        enum: ['New', 'Hot', 'Warm', 'Cold', 'Converted'],
        default: 'Warm'
    },
    projectInterest: {
        type: String,
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
