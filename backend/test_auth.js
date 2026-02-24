
const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'superadmin@media-masala.com',
      password: 'Password@123'
    });
    console.log('Login Success:', res.status);
    console.log('Token Received:', !!res.data.token);
  } catch (err) {
    console.error('Login Failed:', err.response ? err.response.status : err.message);
    if (err.response) {
      console.error('Error Body:', err.response.data);
    }
  }
}

testLogin();
