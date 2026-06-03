const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const jwtSecret = process.env.SUPABASE_JWT_SECRET;
const serverPort = process.env.PORT || 4000;
const serverUrl = `http://localhost:${serverPort}`;

if (!jwtSecret || jwtSecret === '[YOUR-SUPABASE-JWT-SECRET-DO-NOT-EXPOSE-ON-CLIENT]') {
  console.error('❌ Error: Please configure a valid SUPABASE_JWT_SECRET in your server/.env file.');
  process.exit(1);
}

// 1. Generate a mock JWT containing typical OAuth claims
const payload = {
  sub: '99e69fb7-c812-4217-bc22-3850025ea451', // Mock User UUID
  email: 'testuser@slay.health',
  role: 'authenticated',
  scope: 'profile email offline_access', // Simulated OAuth scopes
  iss: 'supabase/oauth',
  exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expires in 1 hour
};

console.log('🔑 Generating mock OAuth JWT...');
const token = jwt.sign(payload, jwtSecret);
console.log(`🎫 Mock Token: ${token.substring(0, 20)}...[truncated]\n`);

// 2. Query the Express API
async function runTest() {
  console.log(`🛰️ Sending request to health check: GET ${serverUrl}/health`);
  try {
    const healthRes = await fetch(`${serverUrl}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health status:', healthData);
  } catch (err) {
    console.error('❌ Server health check failed. Is the server running?');
    return;
  }

  console.log(`\n🛰️ Sending request without token: GET ${serverUrl}/api/auth/me`);
  try {
    const res = await fetch(`${serverUrl}/api/auth/me`);
    console.log(`❌ Status (should be 401): ${res.status}`);
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Request failed:', err);
  }

  console.log(`\n🛰️ Sending request with valid Bearer Token: GET ${serverUrl}/api/auth/me`);
  try {
    const res = await fetch(`${serverUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Status (should be 200): ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Request failed:', err);
  }
}

runTest();
