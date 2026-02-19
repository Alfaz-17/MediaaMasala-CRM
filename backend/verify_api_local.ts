


const API = 'http://localhost:4000/api';

async function main() {
  // 1. Login as Admin
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@media-masala.com', password: 'Password@123' }),
  });
  
  if (!res.ok) {
    console.error('Login failed:', res.status, await res.text());
    return;
  }

  const { token } = await res.json();
  console.log('✅ Logged in as Admin');

  // 2. Fetch Permissions Matrix
  const matrixRes = await fetch(`${API}/admin/permissions-matrix`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (matrixRes.ok) {
    console.log('✅ /api/admin/permissions-matrix is reachable (200 OK)');
    const data = await matrixRes.json();
    console.log(`   Returning ${data.permissions?.length} permissions and ${data.roles?.length} roles`);
  } else {
    console.error('❌ /api/admin/permissions-matrix failed:', matrixRes.status, await matrixRes.text());
  }
}

main().catch(console.error);
