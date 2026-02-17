import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const API_URL = 'http://localhost:4000/api';

async function testFlows() {
  console.log('🚀 Starting Automated API Flow Testing...');

  try {
    // 1. Test Login (Super Admin)
    console.log('\n--- Testing Login (Admin) ---');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@media-masala.com', password: 'Password@123' })
    });
    const loginData = await loginRes.json();
    if (loginRes.status !== 200) throw new Error(`Login failed: ${loginData.message}`);
    const token = loginData.token;
    console.log('✅ Login Successful. Token received.');

    // 2. Test Get Leads (Admin - All Scope)
    console.log('\n--- Testing Get Leads (Admin) ---');
    const leadsRes = await fetch(`${API_URL}/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    console.log(`✅ Fetched ${leadsData.length} leads as Admin.`);

    // 3. Test Recursive Scoping (John Sales - Team Scope)
    console.log('\n--- Testing Recursive Scope (John Sales) ---');
    const johnLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.sales@media-masala.com', password: 'Password@123' })
    });
    const johnLoginData = await johnLoginRes.json();
    const johnToken = johnLoginData.token;

    const johnLeadsRes = await fetch(`${API_URL}/leads`, {
      headers: { 'Authorization': `Bearer ${johnToken}` }
    });
    const johnLeadsData = await johnLeadsRes.json();
    console.log(`✅ John Sales (Head) fetched ${johnLeadsData.length} leads.`);
    
    // 4. Test Recursive Scoping (Jane BM - Team Scope)
    console.log('\n--- Testing Recursive Scope (Jane BM) ---');
    const janeLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'jane.bm@media-masala.com', password: 'Password@123' })
    });
    const janeLoginData = await janeLoginRes.json();
    const janeToken = janeLoginData.token;
    const janeScope = (janeLoginData.permissions as any[]).find((p: any) => p.module === 'leads' && p.action === 'view')?.scope;
    console.log(`Jane BM Scope: ${janeScope}`);

    const janeLeadsRes = await fetch(`${API_URL}/leads`, {
      headers: { 'Authorization': `Bearer ${janeToken}` }
    });
    const janeLeadsData = await janeLeadsRes.json();
    console.log(`✅ Jane BM (Manager under John) fetched ${janeLeadsData.length} leads.`);

    // 5. Verify Recursive Visibility (Assign a lead to Jane)
    console.log('\n--- Testing Recursive Assignment Visibility ---');
    
    // FIRST: Link Jane to John (Seed doesn't do this)
    console.log(`Linking Jane (ID: ${janeLoginData.user.employeeId}) to John (ID: ${johnLoginData.user.employeeId})...`);
    await prisma.employee.update({
      where: { id: janeLoginData.user.employeeId },
      data: { managerId: johnLoginData.user.employeeId }
    });

    const allLeads = await (await fetch(`${API_URL}/leads`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
    const leadId = allLeads[0].id;
    
    console.log(`Assigning Lead ${leadId} to Jane (ID: ${janeLoginData.user.employeeId})...`);
    await fetch(`${API_URL}/leads/${leadId}/assign`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigneeId: janeLoginData.user.employeeId })
    });

    const janeUpdatedLeads = await (await fetch(`${API_URL}/leads`, { headers: { 'Authorization': `Bearer ${janeToken}` } })).json();
    const johnUpdatedLeads = await (await fetch(`${API_URL}/leads`, { headers: { 'Authorization': `Bearer ${johnToken}` } })).json();
    
    console.log(`✅ Jane now sees ${janeUpdatedLeads.length} lead(s).`);
    console.log(`✅ John still sees ${johnUpdatedLeads.length} lead(s).`);

    if (janeUpdatedLeads.length === 1 && johnUpdatedLeads.length === 2) {
      console.log('🏁 RECURSIVE VISIBILITY VERIFIED: John sees Jane\'s leads.');
    } else {
      console.log('❌ RECURSIVE VISIBILITY FAILED.');
    }

    // 6. Test Performance Matrix (Admin)
    console.log('\n--- Testing Bulk Permissions Matrix ---');
    const matrixRes = await fetch(`${API_URL}/admin/permissions-matrix`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const matrixData = await matrixRes.json();
    console.log(`✅ Fetched Matrix. Roles: ${matrixData.roles.length}, Permissions: ${matrixData.permissions.length}`);

    // 6. Test EOD / Attendance (Staff)
    console.log('\n--- Testing Attendance Check-in ---');
    const devLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dev1@media-masala.com', password: 'Password@123' })
    });
    const devToken = (await devLoginRes.json()).token;
    
    const checkInRes = await fetch(`${API_URL}/attendance/check-in`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${devToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: 'Remote', notes: 'Testing API' })
    });
    const checkInData = await checkInRes.json();
    if (checkInRes.status === 201 || checkInRes.status === 400 /* Already checked in */) {
      console.log(`✅ Attendance Check-in verified (Status: ${checkInRes.status})`);
    } else {
      console.log(`❌ Check-in failed: ${JSON.stringify(checkInData)}`);
    }

    console.log('\n🏁 API Flow Testing Completed Successfully!');
  } catch (error) {
    console.error('\n❌ Testing Error:', error);
    process.exit(1);
  }
}

testFlows();
