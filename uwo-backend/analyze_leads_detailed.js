import mongoose from 'mongoose';
import 'dotenv/config';
import Lead from './models/Lead.js';

async function analyzeStatuses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const leads = await Lead.find();
        console.log(`Total Leads: ${leads.length}`);

        const statusCounts = {};
        leads.forEach(l => {
            statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
        });

        console.log('Status Counts:', JSON.stringify(statusCounts, null, 2));

        const sample = leads.slice(0, 3).map(l => ({
            name: l.name,
            status: l.status,
            source: l.source
        }));
        console.log('Sample Leads:', JSON.stringify(sample, null, 2));

        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

analyzeStatuses();
