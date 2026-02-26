import mongoose from 'mongoose';
import 'dotenv/config';
import Lead from './models/Lead.js';

async function checkLeads() {
    console.log('Connecting to:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');
        const count = await Lead.countDocuments();
        console.log('Lead Count:', count);
        const leads = await Lead.find().limit(5);
        console.log('Sample Leads:', JSON.stringify(leads, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

checkLeads();
