/**
 * SALES HIERARCHY AUTOMATED TEST
 * ===============================
 * Tests scoped filtering by logging in as each role and verifying data visibility.
 * 
 * Run: npx ts-node test_hierarchy.ts
 * Requires: Backend running on http://localhost:4000
 */

const API = 'http://localhost:4000/api';

// ── Test Accounts ──
const accounts = [
  { label: 'Admin',       email: 'superadmin@media-masala.com', password: 'Password@123', scope: 'all' },
  { label: 'Sales HOD',   email: 'sales.hod@test.com',         password: 'Password@123', scope: 'department' },
  { label: 'Sales BM',    email: 'sales.bm@test.com',          password: 'Password@123', scope: 'team' },
  { label: 'Sales BDM-1', email: 'sales.bdm1@test.com',        password: 'Password@123', scope: 'team' },
  { label: 'Sales BDM-2', email: 'sales.bdm2@test.com',        password: 'Password@123', scope: 'team' },
  { label: 'Sales BDE-1A',email: 'sales.bde1a@test.com',       password: 'Password@123', scope: 'own' },
  { label: 'Sales BDE-1B',email: 'sales.bde1b@test.com',       password: 'Password@123', scope: 'own' },
  { label: 'Sales BDE-2A',email: 'sales.bde2a@test.com',       password: 'Password@123', scope: 'own' },
];

// ── Expected Lead Counts ──
// Admin: 80+ (all depts), HOD: 80 (whole Sales dept), BM: 80 (recursive team),
// BDM-1: 40 (4 BDEs × 10), BDM-2: 40 (4 BDEs × 10), BDE: 10 each
const expectedLeads: Record<string, { min: number; max: number }> = {
  'Admin':        { min: 80, max: 999 },  // 80+ (may include other dept leads)
  'Sales HOD':    { min: 80, max: 999 },  // whole department
  'Sales BM':     { min: 80, max: 80 },   // recursive team = all 8 BDEs
  'Sales BDM-1':  { min: 40, max: 40 },   // 4 BDEs × 10 leads
  'Sales BDM-2':  { min: 40, max: 40 },   // 4 BDEs × 10 leads
  'Sales BDE-1A': { min: 10, max: 10 },   // own leads only
  'Sales BDE-1B': { min: 10, max: 10 },
  'Sales BDE-2A': { min: 10, max: 10 },
};

// ── Helpers ──
let passed = 0;
let failed = 0;
const results: string[] = [];

function log(icon: string, msg: string) {
  const line = `${icon}  ${msg}`;
  results.push(line);
  console.log(line);
}

async function login(email: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token;
  } catch (e) {
    return null;
  }
}

async function getLeads(token: string): Promise<any[]> {
  const res = await fetch(`${API}/leads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data.leads || []);
}

async function getAttendance(token: string): Promise<any[]> {
  const res = await fetch(`${API}/attendance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function getEod(token: string): Promise<any[]> {
  const res = await fetch(`${API}/eod`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function assertRange(label: string, testName: string, actual: number, min: number, max: number) {
  if (actual >= min && actual <= max) {
    log('✅', `[${label}] ${testName}: ${actual} (expected ${min}-${max})`);
    passed++;
  } else {
    log('❌', `[${label}] ${testName}: ${actual} (expected ${min}-${max})`);
    failed++;
  }
}

// ── Cross-Visibility Tests ──
async function testCrossVisibility(token: string, label: string, allLeads: any[]) {
  // BDE-1A should NOT see leads owned by BDE-2A
  if (label === 'Sales BDE-1A') {
    const foreignLeads = allLeads.filter((l: any) => l.name?.startsWith('Lead-BDE2A'));
    if (foreignLeads.length === 0) {
      log('✅', `[${label}] SECURITY: Cannot see BDE-2A's leads`);
      passed++;
    } else {
      log('❌', `[${label}] SECURITY: Can see ${foreignLeads.length} of BDE-2A's leads!`);
      failed++;
    }
  }

  // BDM-1 should NOT see BDM-2's team leads
  if (label === 'Sales BDM-1') {
    const foreignLeads = allLeads.filter((l: any) =>
      l.name?.startsWith('Lead-BDE2A') || l.name?.startsWith('Lead-BDE2B') ||
      l.name?.startsWith('Lead-BDE2C') || l.name?.startsWith('Lead-BDE2D')
    );
    if (foreignLeads.length === 0) {
      log('✅', `[${label}] SECURITY: Cannot see BDM-2's team leads`);
      passed++;
    } else {
      log('❌', `[${label}] SECURITY: Can see ${foreignLeads.length} of BDM-2's team leads!`);
      failed++;
    }
  }

  // BDM-2 should NOT see BDM-1's team leads
  if (label === 'Sales BDM-2') {
    const foreignLeads = allLeads.filter((l: any) =>
      l.name?.startsWith('Lead-BDE1A') || l.name?.startsWith('Lead-BDE1B') ||
      l.name?.startsWith('Lead-BDE1C') || l.name?.startsWith('Lead-BDE1D')
    );
    if (foreignLeads.length === 0) {
      log('✅', `[${label}] SECURITY: Cannot see BDM-1's team leads`);
      passed++;
    } else {
      log('❌', `[${label}] SECURITY: Can see ${foreignLeads.length} of BDM-1's team leads!`);
      failed++;
    }
  }
}

// ── Main Test Runner ──
async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     SALES HIERARCHY SCOPED FILTERING TESTS      ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // ── 1. LOGIN TESTS ──
  console.log('━━━ TEST GROUP 1: Authentication ━━━');
  const tokens: Record<string, string> = {};
  for (const acc of accounts) {
    const token = await login(acc.email, acc.password);
    if (token) {
      log('✅', `[${acc.label}] Login successful`);
      tokens[acc.label] = token;
      passed++;
    } else {
      log('❌', `[${acc.label}] Login FAILED`);
      failed++;
    }
  }

  // ── 2. LEADS VISIBILITY TESTS ──
  console.log('\n━━━ TEST GROUP 2: Leads Visibility ━━━');
  for (const acc of accounts) {
    const token = tokens[acc.label];
    if (!token) { log('⏭️', `[${acc.label}] Skipped (no token)`); continue; }

    const leads = await getLeads(token);
    const expected = expectedLeads[acc.label];
    assertRange(acc.label, 'Leads count', leads.length, expected.min, expected.max);
  }

  // ── 3. CROSS-VISIBILITY (SECURITY) TESTS ──
  console.log('\n━━━ TEST GROUP 3: Security / Cross-Visibility ━━━');
  for (const acc of accounts) {
    const token = tokens[acc.label];
    if (!token) continue;
    const leads = await getLeads(token);
    await testCrossVisibility(token, acc.label, leads);
  }

  // ── 4. FILTERED API TESTS ──
  console.log('\n━━━ TEST GROUP 4: API Filter Parameters ━━━');
  
  // Admin filtering by specific employee should work
  if (tokens['Admin']) {
    // Get BDE-1A's employee ID from their leads
    const adminLeads = await getLeads(tokens['Admin']);
    const bde1aLead = adminLeads.find((l: any) => l.name?.startsWith('Lead-BDE1A'));
    if (bde1aLead?.ownerId) {
      const filteredRes = await fetch(`${API}/leads?employeeId=${bde1aLead.ownerId}`, {
        headers: { Authorization: `Bearer ${tokens['Admin']}` },
      });
      const filteredData = await filteredRes.json();
      const filteredLeads = Array.isArray(filteredData) ? filteredData : (filteredData.leads || []);
      assertRange('Admin', 'Filter by BDE-1A employeeId', filteredLeads.length, 10, 10);
    }
  }

  // BDE trying to use employeeId of another BDE should still only see own
  if (tokens['Sales BDE-1A'] && tokens['Admin']) {
    const adminLeads = await getLeads(tokens['Admin']);
    const bde2aLead = adminLeads.find((l: any) => l.name?.startsWith('Lead-BDE2A'));
    if (bde2aLead?.ownerId) {
      const bypassRes = await fetch(`${API}/leads?employeeId=${bde2aLead.ownerId}`, {
        headers: { Authorization: `Bearer ${tokens['Sales BDE-1A']}` },
      });
      const bypassData = await bypassRes.json();
      const bypassLeads = Array.isArray(bypassData) ? bypassData : (bypassData.leads || []);
      // BDE-1A should still see only 10 (their own), NOT BDE-2A's leads
      if (bypassLeads.length <= 10 && !bypassLeads.some((l: any) => l.name?.startsWith('Lead-BDE2A'))) {
        log('✅', `[BDE-1A] SECURITY: API param bypass blocked — still sees own leads only`);
        passed++;
      } else {
        log('❌', `[BDE-1A] SECURITY: API param bypass NOT blocked — sees ${bypassLeads.length} leads`);
        failed++;
      }
    }
  }

  // ── SUMMARY ──
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║  RESULTS:  ${passed} PASSED  |  ${failed} FAILED                  ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Review the results above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! The hierarchy filtering is working correctly.');
  }
}

main().catch(console.error);
