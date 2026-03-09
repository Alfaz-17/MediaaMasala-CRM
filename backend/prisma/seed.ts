import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting System Seeding (Clean Production) ---');

  try {
    // 0. Cleanup ALL existing data
    console.log('--- Cleaning up ALL existing data ---');
    
    await prisma.activityLog.deleteMany({});
    await prisma.followUpLog.deleteMany({});
    await prisma.leadNote.deleteMany({});
    await prisma.leadAssignmentLog.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.leaveRequest.deleteMany({});
    await prisma.eodReport.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.department.deleteMany({});
    
    console.log('✅ All data wiped clean');

    // 1. Create only the Admin department
    const adminDept = await prisma.department.create({
      data: { name: 'Administration', code: 'ADMIN', description: 'Central Management' },
    });
    console.log('✅ Admin department created');

    // 2. Create only the Admin role
    const adminRole = await prisma.role.create({
      data: {
        name: 'Admin',
        code: 'ADMIN',
        description: 'Full system control',
        departmentId: adminDept.id,
      },
    });
    console.log('✅ Admin role created');

    // 3. Create Permissions (system-level definitions needed for RBAC to work)
    const moduleActionMap: Record<string, string[]> = {
      leads:      ['view', 'create', 'edit', 'delete', 'assign'],
      tasks:      ['view', 'create', 'edit', 'delete', 'assign'],
      projects:   ['view', 'create', 'edit', 'delete'],
      products:   ['view', 'create', 'edit', 'delete'],
      attendance: ['view', 'create', 'approve'],
      leaves:     ['view', 'create', 'approve'],
      eod:        ['view', 'create', 'edit'],
      reports:    ['view', 'generate'],
      employees:  ['view', 'edit', 'manage'],
      activity:   ['view'],
      dashboard:  ['view'],
    };

    const scopes = ['own', 'team', 'department', 'all'];
    const permissions: any[] = [];
    for (const [module, actions] of Object.entries(moduleActionMap)) {
      for (const action of actions) {
        for (const scopeType of scopes) {
          permissions.push({ module, action, scopeType });
        }
      }
    }

    await prisma.permission.createMany({ data: permissions, skipDuplicates: true });
    console.log(`✅ ${permissions.length} permissions seeded`);

    // 4. Give Admin role ALL permissions
    const allPerms = await prisma.permission.findMany();
    await prisma.rolePermission.createMany({
      data: allPerms.map(p => ({ roleId: adminRole.id, permissionId: p.id })),
      skipDuplicates: true,
    });
    console.log('✅ Admin role mapped to all permissions');

    // 5. Create Admin user & employee
    const adminEmail = 'mediaamasala@gmail.com';
    const hashedPassword = await bcrypt.hash('mediaa@crm07', 10);

    const adminUser = await prisma.user.create({
      data: { email: adminEmail, passwordHash: hashedPassword },
    });

    await prisma.employee.create({
      data: {
        empId: 'EMP001',
        userId: adminUser.id,
        firstName: 'Mediaa',
        lastName: 'Masala',
        email: adminEmail,
        departmentId: adminDept.id,
        roleId: adminRole.id,
      },
    });
    console.log('✅ Admin account created');

    console.log('');
    console.log('🚀 Production Seeding Complete!');
    console.log('   Admin: mediaamasala@gmail.com / mediaa@crm07');
    console.log('   Only admin department, admin role, permissions, and admin account exist.');
    console.log('   Create departments, roles, and employees from the dashboard.');

  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
