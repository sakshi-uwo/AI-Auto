import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'meenakshipatel928@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:');
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Status:', user.status);
            // Don't log password hash for security, but we know it exists
        } else {
            console.log('User NOT found:', email);
            const allUsers = await User.find({}, 'email role status');
            console.log('Available users:', allUsers);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkUser();
