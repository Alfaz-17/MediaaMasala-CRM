/**
 * FULL E2E HIERARCHY TEST (Frontend-Backend Flow Simulation)
 * ============================================================
 * Simulates exactly what the frontend does for each role:
 *   1. Login (get JWT)
 *   2. Fetch Leads, Attendance, EOD, Leaves, Projects
 *   3. Test filtered queries (Department & Employee filters)
 *   4. Verify cross-role isolation & security
 *
 * Run:  npx ts-node test_e2e_hierarchy.ts
 */

const API = 'http://localhost:4000/api';

// ── All Test Accounts ──
const ACCOUNTS = {
  admin:  { email: 'superadmin@media-masala.com', password: 'Password@123', label: 'Admin',       expectedScope: 'all' },
  hod:    { email: 'sales.hod@test.com',          password: 'Password@123', label: 'Sales HOD',   expectedScope: 'department' },
  bm:     { email: 'sales.bm@test.com',           password: 'Password@123', label: 'Sales BM',    expectedScope: 'team' },
  bdm1:   { email: 'sales.bdm1@test.com',         password: 'Password@123', label: 'Sales BDM-1', expectedScope: 'team' },
  bdm2:   { email: 'sales.bdm2@test.com',         password: 'Password@123', label: 'Sales BDM-2', expectedScope: 'team' },
  bde1a:  { email: 'sales.bde1a@test.com',        password: 'Password@123', label: 'Sales BDE-1A',expectedScope: 'own' },
  bde1b:  { email: 'sales.bde1b@test.com',        password: 'Password@123', label: 'Sales BDE-1B',expectedScope: 'own' },
  bde2a:  { email: 'sales.bde2a@test.com',        password: 'Password@123', label: 'Sales BDE-2A',expectedScope: 'own' },
  bde2d:  { email: 'sales.bde2d@test.com',        password: 'Password@123', label: 'Sales BDE-2D',expectedScope: 'own' },
};

// ── Test Results ──
let passed = 0, failed = 0, skipped = 0;
const log = (icon: string, msg: string) => console.log(`  ${icon}  ${msg}`);
const pass = (msg: string) => { log('✅', msg); passed++; };
const fail = (msg: string) => { log('❌', msg); failed++; };
const skip = (msg: string) => { log('⏭️', msg); skipped++; };

// ── API Helpers ──
async function login(email: string, password: string): Promise<{ token: string; user: any; permissions: any[] } | null> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function apiGet(endpoint: string, token: string): Promise<any> {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { _status: res.status, _error: true };
    return await res.json();
  } catch { return { _error: true }; }
}

// ══════════════════════════════════════════════════
//  TEST SUITES
// ══════════════════════════════════════════════════

async function testAuthentication() {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 1: Authentication & Session      │');
  console.log('└──────────────────────────────────────────────┘');

  const tokens: Record<string, { token: string; user: any; permissions: any[] }> = {};

  for (const [key, acc] of Object.entries(ACCOUNTS)) {
    const result = await login(acc.email, acc.password);
    if (result) {
      tokens[key] = result;
      pass(`[${acc.label}] Login OK → role: ${result.user.role}, dept: ${result.user.department}`);

      // Verify /auth/me endpoint (frontend session check)
      const me = await apiGet('/auth/me', result.token);
      if (me?.user?.email === acc.email) {
        pass(`[${acc.label}] /auth/me returns correct user`);
      } else {
        fail(`[${acc.label}] /auth/me returned wrong user`);
      }

      // Check permissions exist
      if (result.permissions && result.permissions.length > 0) {
        pass(`[${acc.label}] Has ${result.permissions.length} permissions`);
      } else {
        fail(`[${acc.label}] No permissions assigned!`);
      }
    } else {
      fail(`[${acc.label}] Login FAILED`);
    }
  }

  return tokens;
}

async function testLeadsVisibility(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 2: Leads Visibility              │');
  console.log('└──────────────────────────────────────────────┘');

  const expected: Record<string, { min: number; max: number }> = {
    admin:  { min: 80, max: 999 },
    hod:    { min: 80, max: 999 },
    bm:     { min: 80, max: 80 },
    bdm1:   { min: 40, max: 40 },
    bdm2:   { min: 40, max: 40 },
    bde1a:  { min: 10, max: 10 },
    bde1b:  { min: 10, max: 10 },
    bde2a:  { min: 10, max: 10 },
    bde2d:  { min: 10, max: 10 },
  };

  for (const [key, session] of Object.entries(tokens)) {
    const data = await apiGet('/leads', session.token);
    const leads = Array.isArray(data) ? data : (data?.leads || []);
    const exp = expected[key];
    const acc = (ACCOUNTS as any)[key];

    if (leads.length >= exp.min && leads.length <= exp.max) {
      pass(`[${acc.label}] Leads: ${leads.length} (expected ${exp.min}-${exp.max})`);
    } else {
      fail(`[${acc.label}] Leads: ${leads.length} (expected ${exp.min}-${exp.max})`);
    }
  }
}

async function testCrossVisibilitySecurity(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 3: Cross-Role Security           │');
  console.log('└──────────────────────────────────────────────┘');

  // BDE-1A should NOT see BDE-2A leads
  if (tokens.bde1a) {
    const data = await apiGet('/leads', tokens.bde1a.token);
    const leads = Array.isArray(data) ? data : (data?.leads || []);
    const foreign = leads.filter((l: any) => l.name && !l.name.startsWith('Lead-BDE1A'));
    if (foreign.length === 0) {
      pass('[BDE-1A] Cannot see any other BDE leads');
    } else {
      fail(`[BDE-1A] Can see ${foreign.length} foreign leads: ${foreign.map((l: any) => l.name).join(', ')}`);
    }
  }

  // BDM-1 should NOT see BDM-2 team leads
  if (tokens.bdm1) {
    const data = await apiGet('/leads', tokens.bdm1.token);
    const leads = Array.isArray(data) ? data : (data?.leads || []);
    const team2Leads = leads.filter((l: any) =>
      l.name?.startsWith('Lead-BDE2A') || l.name?.startsWith('Lead-BDE2B') ||
      l.name?.startsWith('Lead-BDE2C') || l.name?.startsWith('Lead-BDE2D')
    );
    if (team2Leads.length === 0) {
      pass('[BDM-1] Cannot see BDM-2 team leads');
    } else {
      fail(`[BDM-1] Can see ${team2Leads.length} of BDM-2 team leads`);
    }
  }

  // BDM-2 should NOT see BDM-1 team leads
  if (tokens.bdm2) {
    const data = await apiGet('/leads', tokens.bdm2.token);
    const leads = Array.isArray(data) ? data : (data?.leads || []);
    const team1Leads = leads.filter((l: any) =>
      l.name?.startsWith('Lead-BDE1A') || l.name?.startsWith('Lead-BDE1B') ||
      l.name?.startsWith('Lead-BDE1C') || l.name?.startsWith('Lead-BDE1D')
    );
    if (team1Leads.length === 0) {
      pass('[BDM-2] Cannot see BDM-1 team leads');
    } else {
      fail(`[BDM-2] Can see ${team1Leads.length} of BDM-1 team leads`);
    }
  }

  // BM should see ALL 80 (recursive team includes both BDMs + all BDEs)
  if (tokens.bm) {
    const data = await apiGet('/leads', tokens.bm.token);
    const leads = Array.isArray(data) ? data : (data?.leads || []);
    const team1 = leads.filter((l: any) => l.name?.startsWith('Lead-BDE1'));
    const team2 = leads.filter((l: any) => l.name?.startsWith('Lead-BDE2'));
    if (team1.length === 40 && team2.length === 40) {
      pass(`[BM] Sees both teams: Team1=${team1.length}, Team2=${team2.length}`);
    } else {
      fail(`[BM] Team split wrong: Team1=${team1.length}/40, Team2=${team2.length}/40`);
    }
  }
}

async function testFilteredAPIs(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 4: Filtered API Requests         │');
  console.log('│  (Simulates ManagementFilters UI dropdowns)   │');
  console.log('└──────────────────────────────────────────────┘');

  // Get a BDE's employee ID for filter testing
  if (tokens.admin) {
    const allLeads = await apiGet('/leads', tokens.admin.token);
    const leads = Array.isArray(allLeads) ? allLeads : (allLeads?.leads || []);
    const bde1aLead = leads.find((l: any) => l.name?.startsWith('Lead-BDE1A'));

    if (bde1aLead?.ownerId) {
      // Admin filters by BDE-1A → should get 10 leads
      const filtered = await apiGet(`/leads?employeeId=${bde1aLead.ownerId}`, tokens.admin.token);
      const filteredLeads = Array.isArray(filtered) ? filtered : (filtered?.leads || []);
      if (filteredLeads.length === 10) {
        pass(`[Admin] Filter by BDE-1A employeeId → ${filteredLeads.length} leads`);
      } else {
        fail(`[Admin] Filter by BDE-1A employeeId → ${filteredLeads.length} leads (expected 10)`);
      }

      // BDE-1A tries to use BDE-2A's employeeId (API bypass attack)
      if (tokens.bde1a) {
        const bde2aLead = leads.find((l: any) => l.name?.startsWith('Lead-BDE2A'));
        if (bde2aLead?.ownerId) {
          const bypassData = await apiGet(`/leads?employeeId=${bde2aLead.ownerId}`, tokens.bde1a.token);
          const bypassLeads = Array.isArray(bypassData) ? bypassData : (bypassData?.leads || []);
          const hasForeignLeads = bypassLeads.some((l: any) => l.name?.startsWith('Lead-BDE2A'));
          if (!hasForeignLeads) {
            pass(`[BDE-1A] API bypass blocked → cannot see BDE-2A leads via employeeId param`);
          } else {
            fail(`[BDE-1A] API bypass NOT blocked → can see BDE-2A leads!`);
          }
        }
      }

      // BDM-1 tries to filter by BDE-2A (not in their team)
      if (tokens.bdm1) {
        const bde2aLead = leads.find((l: any) => l.name?.startsWith('Lead-BDE2A'));
        if (bde2aLead?.ownerId) {
          const crossData = await apiGet(`/leads?employeeId=${bde2aLead.ownerId}`, tokens.bdm1.token);
          const crossLeads = Array.isArray(crossData) ? crossData : (crossData?.leads || []);
          const hasForeignLeads = crossLeads.some((l: any) => l.name?.startsWith('Lead-BDE2A'));
          if (!hasForeignLeads) {
            pass(`[BDM-1] Cannot filter to BDE-2A via API param → still sees own team only`);
          } else {
            fail(`[BDM-1] Cross-team filter NOT blocked → sees BDE-2A leads!`);
          }
        }
      }
    } else {
      skip('Could not find BDE-1A lead for filter testing');
    }
  }
}

async function testAttendanceEndpoint(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 5: Attendance Module Access       │');
  console.log('└──────────────────────────────────────────────┘');

  for (const [key, session] of Object.entries(tokens)) {
    const acc = (ACCOUNTS as any)[key];
    const data = await apiGet('/attendance', session.token);
    if (data?._error && data?._status === 403) {
      skip(`[${acc.label}] Attendance: 403 (no permission)`);
    } else if (data?._error) {
      fail(`[${acc.label}] Attendance: API error`);
    } else {
      const records = Array.isArray(data) ? data : [];
      pass(`[${acc.label}] Attendance: accessible, ${records.length} records`);
    }
  }
}

async function testEodEndpoint(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 6: EOD Reports Module Access      │');
  console.log('└──────────────────────────────────────────────┘');

  for (const [key, session] of Object.entries(tokens)) {
    const acc = (ACCOUNTS as any)[key];
    const data = await apiGet('/eod', session.token);
    if (data?._error && data?._status === 403) {
      skip(`[${acc.label}] EOD: 403 (no permission)`);
    } else if (data?._error) {
      fail(`[${acc.label}] EOD: API error`);
    } else {
      const records = Array.isArray(data) ? data : [];
      pass(`[${acc.label}] EOD: accessible, ${records.length} records`);
    }
  }
}

async function testLeavesEndpoint(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 7: Leaves Module Access           │');
  console.log('└──────────────────────────────────────────────┘');

  for (const [key, session] of Object.entries(tokens)) {
    const acc = (ACCOUNTS as any)[key];
    const data = await apiGet('/leaves', session.token);
    if (data?._error && data?._status === 403) {
      skip(`[${acc.label}] Leaves: 403 (no permission)`);
    } else if (data?._error) {
      fail(`[${acc.label}] Leaves: API error`);
    } else {
      const records = Array.isArray(data) ? data : [];
      pass(`[${acc.label}] Leaves: accessible, ${records.length} records`);
    }
  }
}

async function testProjectsEndpoint(tokens: Record<string, { token: string; user: any; permissions: any[] }>) {
  console.log('\n┌──────────────────────────────────────────────┐');
  console.log('│  TEST SUITE 8: Projects Module Access         │');
  console.log('└──────────────────────────────────────────────┘');

  for (const [key, session] of Object.entries(tokens)) {
    const acc = (ACCOUNTS as any)[key];
    const data = await apiGet('/projects', session.token);
    if (data?._error && data?._status === 403) {
      skip(`[${acc.label}] Projects: 403 (no permission)`);
    } else if (data?._error) {
      fail(`[${acc.label}] Projects: API error`);
    } else {
      const records = Array.isArray(data) ? data : [];
      pass(`[${acc.label}] Projects: accessible, ${records.length} records`);
    }
  }
}

// ══════════════════════════════════════════════════
//  MAIN RUNNER
// ══════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   FULL E2E HIERARCHY TESTS                      ║');
  console.log('║   Testing Frontend-Backend Data Flow             ║');
  console.log('╚══════════════════════════════════════════════════╝');

  const tokens = await testAuthentication();
  await testLeadsVisibility(tokens);
  await testCrossVisibilitySecurity(tokens);
  await testFilteredAPIs(tokens);
  await testAttendanceEndpoint(tokens);
  await testEodEndpoint(tokens);
  await testLeavesEndpoint(tokens);
  await testProjectsEndpoint(tokens);

  // ── Final Summary ──
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║  ✅ PASSED: ${String(passed).padEnd(4)}   ❌ FAILED: ${String(failed).padEnd(4)}   ⏭️ SKIPPED: ${String(skipped).padEnd(4)}║`);
  console.log('╚══════════════════════════════════════════════════╝');

  if (failed > 0) {
    console.log('\n⚠️  Some tests failed! Review the results above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Frontend-Backend flow is working correctly.');
    console.log('   You can now proceed with manual testing in the browser.');
  }
}

main().catch(console.error);
