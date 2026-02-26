import mongoose from 'mongoose';
import 'dotenv/config';
import SystemSettings from './models/SystemSettings.js';

async function checkSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const settings = await SystemSettings.findOne();
        console.log('System Settings:', JSON.stringify(settings, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

checkSettings();
