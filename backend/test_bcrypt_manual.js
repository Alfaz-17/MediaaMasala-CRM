
const bcrypt = require('bcrypt');

async function testBcrypt() {
  const password = 'Password@123';
  const rounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, rounds);
    console.log('Hash generated:', hash);
    const isValid = await bcrypt.compare(password, hash);
    console.log('Comparison successful:', isValid);
  } catch (err) {
    console.error('Bcrypt error:', err);
  }
}

testBcrypt();
