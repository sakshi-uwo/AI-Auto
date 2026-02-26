import 'dotenv/config';
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'FOUND (hidden)' : 'NOT FOUND');
console.log('GCP_PROJECT_ID:', process.env.GCP_PROJECT_ID || 'NOT FOUND');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'FOUND (hidden)' : 'NOT FOUND');
