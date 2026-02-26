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
    leadScore: {
        type: Number,
        default: 0
    },
    leadTemperature: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold'],
        default: 'Cold'
    },
    lastEngagementAt: {
        type: Date,
        default: Date.now
    },
    engagementSignals: {
        // Behavioral
        demoRequested: { type: Boolean, default: false },
        contactFormSubmitted: { type: Boolean, default: false },
        pricingPageVisits: { type: Number, default: 0 },
        websiteVisits: { type: Number, default: 0 },
        emailOpens: { type: Number, default: 0 },
        linkClicks: { type: Number, default: 0 },
        bookedMeeting: { type: Boolean, default: false },
        contactedSales: { type: Boolean, default: false },

        // Profile Fit
        industryMatch: { type: Boolean, default: false },
        companySizeMatch: { type: Boolean, default: false },
        verifiedEmail: { type: Boolean, default: false },
        verifiedPhone: { type: Boolean, default: false },

        // Negative Signals
        unsubscribed: { type: Boolean, default: false }
    },
    isSimulated: {
        type: Boolean,
        default: false
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
