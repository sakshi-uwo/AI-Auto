import mongoose from 'mongoose';
import 'dotenv/config';
import SiteVisit from './models/SiteVisit.js';
import Lead from './models/Lead.js';

async function checkVisits() {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        const count = await SiteVisit.countDocuments();
        console.log('Site Visit Count:', count);

        const visits = await SiteVisit.find().populate('lead').limit(5);
        console.log('Sample Visits:', JSON.stringify(visits, null, 2));

        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error:', err.stack || err.message);
    }
}

checkVisits();
