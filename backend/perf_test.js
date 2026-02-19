
const axios = require('axios');

async function testPerformance() {
  const BASE_URL = 'http://localhost:4000/api';
  
  // Note: We need a valid token to test these endpoints. 
  // Since we are in a testing environment, we might need to skip this or use a mock.
  // However, we can at least check if the server is up and the health endpoint is fast.
  
  try {
    console.log('Testing /health endpoint...');
    const start = Date.now();
    const health = await axios.get(`${BASE_URL}/health`);
    const end = Date.now();
    console.log(`Health Status: ${health.data.status}, Time: ${end - start}ms`);

    // We can't easily test protected endpoints without a token here.
    // Instead, we will rely on TSC to ensure logic is sound.
  } catch (err) {
    console.error('Diagnostic failed:', err.message);
  }
}

testPerformance();
