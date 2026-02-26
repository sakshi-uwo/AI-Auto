import axios from 'axios';

async function simulateLead() {
    try {
        const response = await axios.post('http://localhost:5000/api/lead', {
            name: "Test Lead Realtime",
            email: "test@realtime.com",
            phone: "1234567890",
            source: "Website",
            status: "Hot",
            projectInterest: "Skyline Towers"
        });
        console.log('✅ Lead created:', response.data.name);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

simulateLead();
