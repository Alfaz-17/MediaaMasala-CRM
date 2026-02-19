import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * SALES DEPARTMENT HIERARCHY TEST SEED
 * =====================================
 * 
 *   Admin (superadmin@media-masala.com)  ← already exists
 *   └── Sales-HOD  (sales.hod@test.com)
 *       └── Sales-BM  (sales.bm@test.com)
 *           ├── Sales-BDM-1  (sales.bdm1@test.com)
 *           │   ├── Sales-BDE-1A  (sales.bde1a@test.com)  → 10 Leads
 *           │   ├── Sales-BDE-1B  (sales.bde1b@test.com)  → 10 Leads
 *           │   ├── Sales-BDE-1C  (sales.bde1c@test.com)  → 10 Leads
 *           │   └── Sales-BDE-1D  (sales.bde1d@test.com)  → 10 Leads
 *           └── Sales-BDM-2  (sales.bdm2@test.com)
 *               ├── Sales-BDE-2A  (sales.bde2a@test.com)  → 10 Leads
 *               ├── Sales-BDE-2B  (sales.bde2b@test.com)  → 10 Leads
 *               ├── Sales-BDE-2C  (sales.bde2c@test.com)  → 10 Leads
 *               └── Sales-BDE-2D  (sales.bde2d@test.com)  → 10 Leads
 * 
 *   Total: 12 accounts, 80 leads
 *   Password for all: Password@123
 */

async function main() {
  console.log('=== SALES HIERARCHY TEST SEED ===\n');

  const PASSWORD = await bcrypt.hash('Password@123', 10);

  // 1. Lookup existing references
  const salesDept = await prisma.department.findUnique({ where: { code: 'SALES' } });
  const roleHOD   = await prisma.role.findUnique({ where: { code: 'SALES_HEAD' } });
  const roleBM    = await prisma.role.findUnique({ where: { code: 'SALES_BM' } });
  const roleBDM   = await prisma.role.findUnique({ where: { code: 'SALES_BDM' } });
  const roleBDE   = await prisma.role.findUnique({ where: { code: 'SALES_BDE' } });

  if (!salesDept || !roleHOD || !roleBM || !roleBDM || !roleBDE) {
    console.error('❌ Missing required Sales roles or department. Run the main seed first: npx prisma db seed');
    process.exit(1);
  }

  console.log(`✅ Found Sales Dept (id: ${salesDept.id}) and all roles`);

  // ──────────────────────────────────────────────────
  // 2. Add BDM permissions (missing from main seed)
  // ──────────────────────────────────────────────────
  const bdmPerms = [
    { module: 'leads', action: 'view', scope: 'team' },
    { module: 'leads', action: 'edit', scope: 'team' },
    { module: 'leads', action: 'create', scope: 'all' },
    { module: 'leads', action: 'assign', scope: 'all' },
    { module: 'tasks', action: 'view', scope: 'team' },
    { module: 'tasks', action: 'create', scope: 'all' },
    { module: 'tasks', action: 'edit', scope: 'team' },
    { module: 'tasks', action: 'assign', scope: 'all' },
    { module: 'eod',   action: 'view', scope: 'team' },
    { module: 'eod',   action: 'view', scope: 'team' },
    { module: 'eod',   action: 'create', scope: 'own' },
    { module: 'attendance', action: 'view', scope: 'team' },
    { module: 'attendance', action: 'create', scope: 'own' },
    { module: 'attendance', action: 'approve', scope: 'team' },
    { module: 'reports', action: 'generate', scope: 'team' },
    { module: 'employees', action: 'view', scope: 'team' },
    { module: 'projects', action: 'view', scope: 'department' },
  ];

  for (const p of bdmPerms) {
    const perm = await prisma.permission.findFirst({
      where: { module: p.module, action: p.action, scopeType: p.scope }
    });
    if (perm) {
      // Cleanup conflicting permissions
      const currentRolePerms = await prisma.rolePermission.findMany({
        where: { roleId: roleBDM.id, permission: { module: p.module, action: p.action } },
        include: { permission: true }
      });

      for (const crp of currentRolePerms) {
        if (crp.permission.scopeType !== p.scope) {
             console.log(`   Removing old ${p.module}:${p.action}:${crp.permission.scopeType} for BDM`);
             await prisma.rolePermission.delete({
                 where: { roleId_permissionId: { roleId: roleBDM.id, permissionId: crp.permissionId } }
             });
        }
      }

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleBDM.id, permissionId: perm.id } },
        update: {},
        create: { roleId: roleBDM.id, permissionId: perm.id }
      });
    }
  }
  console.log('✅ BDM permissions mapped');

  // 2.1 Update BM permissions (Enforce Team Scope for Employees)
  const bmPerms = [
    { module: 'employees', action: 'view', scope: 'team' },
    { module: 'eod', action: 'view', scope: 'team' }, 
    { module: 'eod', action: 'create', scope: 'own' },
    { module: 'attendance', action: 'view', scope: 'team' },
    { module: 'attendance', action: 'create', scope: 'own' },
  ];

  for (const p of bmPerms) {
    const perm = await prisma.permission.findFirst({
      where: { module: p.module, action: p.action, scopeType: p.scope }
    });
    if (perm) {
      // Remove conflicting permissions first (like department scope)
      const existingPerms = await prisma.permission.findMany({
        where: { module: p.module, action: p.action } 
      });
      
      // We want to remove any permission for this module/action that IS NOT the target scope
      // But upsert only handles one ID. 
      // Strategy: Find current permission for role+module+action and delete it if it's different scope
      
      const currentRolePerms = await prisma.rolePermission.findMany({
        where: { roleId: roleBM.id, permission: { module: p.module, action: p.action } },
        include: { permission: true }
      });

      for (const crp of currentRolePerms) {
        if (crp.permission.scopeType !== p.scope) {
             console.log(`   Removing old ${p.module}:${p.action}:${crp.permission.scopeType} for BM`);
             await prisma.rolePermission.delete({
                 where: { roleId_permissionId: { roleId: roleBM.id, permissionId: crp.permissionId } }
             });
        }
      }

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleBM.id, permissionId: perm.id } },
        update: {},
        create: { roleId: roleBM.id, permissionId: perm.id }
      });
    }
  }
  console.log('✅ BM permissions updated (forced Team scope)');

  // Also ensure BDE has view permissions for attendance, eod, employees (own scope)
  const bdeExtraPerms = [
    { module: 'attendance', action: 'view', scope: 'own' },
    { module: 'eod',   action: 'view', scope: 'own' },
    { module: 'employees', action: 'view', scope: 'own' },
    { module: 'projects', action: 'view', scope: 'assigned' },
    { module: 'reports', action: 'generate', scope: 'own' },
  ];
  for (const p of bdeExtraPerms) {
    const perm = await prisma.permission.findFirst({
      where: { module: p.module, action: p.action, scopeType: p.scope }
    });
    if (perm) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleBDE.id, permissionId: perm.id } },
        update: {},
        create: { roleId: roleBDE.id, permissionId: perm.id }
      });
    }
  }
  console.log('✅ BDE extra permissions mapped');

  // ──────────────────────────────────────────────────
  // 3. Helper: Create a User + Employee pair
  // ──────────────────────────────────────────────────
  const createStaff = async (
    empId: string, firstName: string, lastName: string, 
    email: string, roleId: number, managerId?: number
  ) => {
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash: PASSWORD },
      create: {
        email,
        passwordHash: PASSWORD,
        roleId,
        departmentId: salesDept.id,
      },
    });

    const emp = await prisma.employee.upsert({
      where: { email },
      update: { managerId: managerId ?? undefined },
      create: {
        empId,
        userId: user.id,
        firstName,
        lastName,
        email,
        departmentId: salesDept.id,
        roleId,
        managerId: managerId ?? undefined,
      },
    });

    console.log(`   👤 ${firstName} ${lastName} (${email}) → empId: ${emp.id}`);
    return emp;
  };

  // ──────────────────────────────────────────────────
  // 4. Create the hierarchy
  // ──────────────────────────────────────────────────
  console.log('\n--- Creating Sales Hierarchy ---');

  // Level 1: HOD
  const hod = await createStaff('TEST-HOD', 'Sales', 'HOD', 'sales.hod@test.com', roleHOD.id);

  // Level 2: BM → reports to HOD
  const bm = await createStaff('TEST-BM', 'Sales', 'BM', 'sales.bm@test.com', roleBM.id, hod.id);

  // Level 3: BDMs → report to BM
  const bdm1 = await createStaff('TEST-BDM1', 'Sales', 'BDM-1', 'sales.bdm1@test.com', roleBDM.id, bm.id);
  const bdm2 = await createStaff('TEST-BDM2', 'Sales', 'BDM-2', 'sales.bdm2@test.com', roleBDM.id, bm.id);

  // Level 4: BDEs → report to their BDM
  // Team 1 (under BDM-1)
  const bde1a = await createStaff('TEST-BDE1A', 'Sales', 'BDE-1A', 'sales.bde1a@test.com', roleBDE.id, bdm1.id);
  const bde1b = await createStaff('TEST-BDE1B', 'Sales', 'BDE-1B', 'sales.bde1b@test.com', roleBDE.id, bdm1.id);
  const bde1c = await createStaff('TEST-BDE1C', 'Sales', 'BDE-1C', 'sales.bde1c@test.com', roleBDE.id, bdm1.id);
  const bde1d = await createStaff('TEST-BDE1D', 'Sales', 'BDE-1D', 'sales.bde1d@test.com', roleBDE.id, bdm1.id);

  // Team 2 (under BDM-2)
  const bde2a = await createStaff('TEST-BDE2A', 'Sales', 'BDE-2A', 'sales.bde2a@test.com', roleBDE.id, bdm2.id);
  const bde2b = await createStaff('TEST-BDE2B', 'Sales', 'BDE-2B', 'sales.bde2b@test.com', roleBDE.id, bdm2.id);
  const bde2c = await createStaff('TEST-BDE2C', 'Sales', 'BDE-2C', 'sales.bde2c@test.com', roleBDE.id, bdm2.id);
  const bde2d = await createStaff('TEST-BDE2D', 'Sales', 'BDE-2D', 'sales.bde2d@test.com', roleBDE.id, bdm2.id);

  console.log('✅ All 12 employees created\n');

  // ──────────────────────────────────────────────────
  // 5. Create 80 Leads (10 per BDE)
  // ──────────────────────────────────────────────────
  console.log('--- Creating 80 Leads ---');

  const sources: any[] = ['Website', 'Referral', 'Cold_Call', 'Email'];
  const statuses: any[] = ['New', 'Follow_Up', 'Prospect', 'Hot_Prospect', 'Proposal_Sent', 'Closing'];

  const allBdes = [
    { emp: bde1a, tag: 'BDE1A' },
    { emp: bde1b, tag: 'BDE1B' },
    { emp: bde1c, tag: 'BDE1C' },
    { emp: bde1d, tag: 'BDE1D' },
    { emp: bde2a, tag: 'BDE2A' },
    { emp: bde2b, tag: 'BDE2B' },
    { emp: bde2c, tag: 'BDE2C' },
    { emp: bde2d, tag: 'BDE2D' },
  ];

  let leadCount = 0;
  for (const bde of allBdes) {
    for (let i = 1; i <= 10; i++) {
      const leadName = `Lead-${bde.tag}-${String(i).padStart(2, '0')}`;
      const leadEmail = `${leadName.toLowerCase().replace(/ /g, '')}@example.com`;

      const exists = await prisma.lead.findFirst({ where: { email: leadEmail } });
      if (!exists) {
        await prisma.lead.create({
          data: {
            name: leadName,
            email: leadEmail,
            phone: `99${String(leadCount + 1).padStart(8, '0')}`,
            company: `Company-${bde.tag}-${i}`,
            source: sources[i % sources.length],
            status: statuses[i % statuses.length],
            ownerId: bde.emp.id,
            departmentId: salesDept.id,
            notes: `Test lead ${i} owned by ${bde.tag}`,
          }
        });
        leadCount++;
      }
    }
    console.log(`   📋 10 leads for ${bde.tag}`);
  }
  console.log(`✅ ${leadCount} leads created\n`);

  // ──────────────────────────────────────────────────
  // 6. Print Summary
  // ──────────────────────────────────────────────────
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║        SALES HIERARCHY TEST ACCOUNTS READY             ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Password for ALL accounts: Password@123               ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Role            Email                    Scope        ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Admin           superadmin@media-masala.com   ALL     ║');
  console.log('║  Sales HOD       sales.hod@test.com      DEPARTMENT   ║');
  console.log('║  Sales BM        sales.bm@test.com       TEAM         ║');
  console.log('║  Sales BDM-1     sales.bdm1@test.com     TEAM         ║');
  console.log('║  Sales BDM-2     sales.bdm2@test.com     TEAM         ║');
  console.log('║  Sales BDE-1A    sales.bde1a@test.com    OWN          ║');
  console.log('║  Sales BDE-1B    sales.bde1b@test.com    OWN          ║');
  console.log('║  Sales BDE-1C    sales.bde1c@test.com    OWN          ║');
  console.log('║  Sales BDE-1D    sales.bde1d@test.com    OWN          ║');
  console.log('║  Sales BDE-2A    sales.bde2a@test.com    OWN          ║');
  console.log('║  Sales BDE-2B    sales.bde2b@test.com    OWN          ║');
  console.log('║  Sales BDE-2C    sales.bde2c@test.com    OWN          ║');
  console.log('║  Sales BDE-2D    sales.bde2d@test.com    OWN          ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Total: 12 employees, 80 leads                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
