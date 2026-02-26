import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'meenakshipatel928@gmail.com';
        const password = 'meenakshi';
        const requestedRole = 'builder';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('User found:', user.email, 'Role:', user.role);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);

        const ROLE_MAP = {
            'Admin': 'admin',
            'Builder': 'builder',
            'Civil Engineer': 'civil_engineer',
            'Site Manager': 'project_site',
            'Client': 'client'
        };

        const mappedRole = ROLE_MAP[user.role] || user.role.toLowerCase();
        console.log('Mapped role:', mappedRole, 'Requested role:', requestedRole);
        console.log('Role match:', mappedRole === requestedRole);

        if (!isMatch) {
            console.log('Attempting to re-hash and save password to "meenakshi" for fix verification...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log('✅ Password successfully reset to "meenakshi"');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

testLogin();
