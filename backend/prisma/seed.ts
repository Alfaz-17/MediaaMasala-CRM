import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting System Seeding ---');

  try {
    // 1. Create Initial Departments
    const departments = [
      { name: 'Administration', code: 'ADMIN', description: 'Central Management' },
      { name: 'Sales', code: 'SALES', description: 'Lead generation and sales' },
      { name: 'Development', code: 'DEV', description: 'Tech and product development' },
      { name: 'Design', code: 'DESIGN', description: 'Graphic and creative design' },
      { name: 'HR', code: 'HR', description: 'Human resources' },
    ];

    for (const dept of departments) {
      await prisma.department.upsert({
        where: { code: dept.code },
        update: {},
        create: dept,
      });
    }
    console.log('✅ Departments seeded');

    // 2. Create Roles (Normalized to Matrix)
    const roles = [
      { name: 'Admin', code: 'ADMIN', description: 'Full system control' },
      { name: 'Head of Dept', code: 'HEAD_DEPT', description: 'Department wide control' },
      { name: 'BM/PM', code: 'BM_PM', description: 'Business/Project Manager (Team Scope)' },
      { name: 'Team Lead', code: 'TL', description: 'Team Lead (Team Scope)' },
      { name: 'Employee', code: 'EMPLOYEE', description: 'Individual Contributor' },
    ];

    for (const role of roles) {
      await prisma.role.upsert({
        where: { code: role.code },
        update: { name: role.name, description: role.description },
        create: role,
      });
    }
    console.log('✅ Roles seeded');

    // 3. Define Comprehensive Permissions
    const permissions = [
      // Leads
      { module: 'leads', action: 'view', scopeType: 'all' },
      { module: 'leads', action: 'view', scopeType: 'department' },
      { module: 'leads', action: 'view', scopeType: 'team' },
      { module: 'leads', action: 'view', scopeType: 'own' },
      { module: 'leads', action: 'edit', scopeType: 'all' },
      { module: 'leads', action: 'edit', scopeType: 'department' },
      { module: 'leads', action: 'edit', scopeType: 'team' },
      { module: 'leads', action: 'edit', scopeType: 'own' },
      { module: 'leads', action: 'create', scopeType: 'all' },
      { module: 'leads', action: 'assign', scopeType: 'all' },
      { module: 'leads', action: 'delete', scopeType: 'all' },
      
      // Tasks
      { module: 'tasks', action: 'view', scopeType: 'all' },
      { module: 'tasks', action: 'view', scopeType: 'department' },
      { module: 'tasks', action: 'view', scopeType: 'team' },
      { module: 'tasks', action: 'view', scopeType: 'own' },
      { module: 'tasks', action: 'create', scopeType: 'all' },
      { module: 'tasks', action: 'edit', scopeType: 'all' },
      { module: 'tasks', action: 'edit', scopeType: 'department' },
      { module: 'tasks', action: 'edit', scopeType: 'team' },
      { module: 'tasks', action: 'edit', scopeType: 'own' },
      { module: 'tasks', action: 'delete', scopeType: 'all' },
      { module: 'tasks', action: 'assign', scopeType: 'all' },
      
      // Projects
      { module: 'projects', action: 'create', scopeType: 'all' },
      { module: 'projects', action: 'view', scopeType: 'all' },
      { module: 'projects', action: 'view', scopeType: 'department' },
      { module: 'projects', action: 'view', scopeType: 'assigned' },
      { module: 'projects', action: 'edit', scopeType: 'all' },
      { module: 'projects', action: 'edit', scopeType: 'department' },
      { module: 'projects', action: 'edit', scopeType: 'assigned' },
      { module: 'projects', action: 'delete', scopeType: 'all' },
      
      // Products
      { module: 'products', action: 'view', scopeType: 'all' },
      { module: 'products', action: 'view', scopeType: 'department' },
      { module: 'products', action: 'view', scopeType: 'own' },
      { module: 'products', action: 'create', scopeType: 'all' },
      { module: 'products', action: 'edit', scopeType: 'all' },
      { module: 'products', action: 'delete', scopeType: 'all' },
      
      // EOD
      { module: 'eod', action: 'view', scopeType: 'all' },
      { module: 'eod', action: 'view', scopeType: 'department' },
      { module: 'eod', action: 'view', scopeType: 'team' },
      { module: 'eod', action: 'view', scopeType: 'own' },
      { module: 'eod', action: 'create', scopeType: 'all' },
      
      // Attendance
      { module: 'attendance', action: 'view', scopeType: 'all' },
      { module: 'attendance', action: 'view', scopeType: 'department' },
      { module: 'attendance', action: 'view', scopeType: 'team' },
      { module: 'attendance', action: 'view', scopeType: 'own' },
      { module: 'attendance', action: 'create', scopeType: 'all' },
      { module: 'attendance', action: 'approve', scopeType: 'all' },
      { module: 'attendance', action: 'approve', scopeType: 'department' },
      { module: 'attendance', action: 'approve', scopeType: 'team' },
      { module: 'attendance', action: 'approve', scopeType: 'own' },
      
      // Employees
      { module: 'employees', action: 'view', scopeType: 'all' },
      { module: 'employees', action: 'view', scopeType: 'department' },
      { module: 'employees', action: 'view', scopeType: 'own' },
      { module: 'employees', action: 'manage', scopeType: 'all' },
      { module: 'employees', action: 'edit', scopeType: 'all' },
      { module: 'employees', action: 'edit', scopeType: 'department' },
      { module: 'employees', action: 'edit', scopeType: 'own' },
      
      // Reports
      { module: 'reports', action: 'generate', scopeType: 'all' },
      { module: 'reports', action: 'generate', scopeType: 'department' },
      { module: 'reports', action: 'generate', scopeType: 'team' },
      { module: 'reports', action: 'generate', scopeType: 'own' },
    ];

    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: {
          module_action_scopeType: {
            module: perm.module,
            action: perm.action,
            scopeType: perm.scopeType,
          },
        },
        update: {},
        create: perm,
      });
    }
    console.log('✅ Permissions seeded');

    // 4. Map Roles to Permissions (Strictly as per Matrix)
    
    // Helper to map role to permissions by module, action, and scope
    const mapRolePerms = async (roleCode: string, perms: {module: string, action: string, scope: string}[]) => {
      const role = await prisma.role.findUnique({ where: { code: roleCode } });
      if (!role) return;
      
      for (const p of perms) {
        const perm = await prisma.permission.findFirst({
          where: { module: p.module, action: p.action, scopeType: p.scope }
        });
        if (perm) {
          await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
            update: {},
            create: { roleId: role.id, permissionId: perm.id }
          });
        }
      }
    };

    // 1. ADMIN: All Access
    const allPerms = await prisma.permission.findMany();
    const adminRole = await prisma.role.findUnique({ where: { code: 'ADMIN' } });
    if (adminRole) {
      for (const p of allPerms) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
          update: {},
          create: { roleId: adminRole.id, permissionId: p.id }
        });
      }
    }

    // 2. HEAD_DEPT
    await mapRolePerms('HEAD_DEPT', [
      { module: 'leads', action: 'view', scope: 'department' },
      { module: 'leads', action: 'edit', scope: 'department' },
      { module: 'leads', action: 'create', scope: 'all' },
      { module: 'leads', action: 'assign', scope: 'all' },
      { module: 'leads', action: 'delete', scope: 'all' },
      { module: 'tasks', action: 'view', scope: 'department' },
      { module: 'tasks', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'edit', scope: 'department' },
      { module: 'tasks', action: 'delete', scope: 'all' },
      { module: 'tasks', action: 'assign', scope: 'all' },
      { module: 'projects', action: 'create', scope: 'all' },
      { module: 'projects', action: 'view', scope: 'department' },
      { module: 'projects', action: 'edit', scope: 'department' },
      { module: 'projects', action: 'delete', scope: 'all' },
      { module: 'products', action: 'view', scope: 'all' },
      { module: 'products', action: 'edit', scope: 'all' },
      { module: 'products', action: 'create', scope: 'all' },
      { module: 'products', action: 'delete', scope: 'all' },
      { module: 'eod', action: 'view', scope: 'department' },
      { module: 'eod', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'view', scope: 'department' },
      { module: 'attendance', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'approve', scope: 'department' },
      { module: 'employees', action: 'view', scope: 'department' },
      { module: 'employees', action: 'edit', scope: 'department' },
      { module: 'reports', action: 'generate', scope: 'department' },
    ]);

    // 3. BM_PM
    await mapRolePerms('BM_PM', [
      { module: 'leads', action: 'view', scope: 'team' },
      { module: 'leads', action: 'edit', scope: 'team' },
      { module: 'leads', action: 'create', scope: 'all' },
      { module: 'leads', action: 'assign', scope: 'all' },
      { module: 'tasks', action: 'view', scope: 'team' },
      { module: 'tasks', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'edit', scope: 'team' },
      { module: 'tasks', action: 'assign', scope: 'all' },
      { module: 'projects', action: 'create', scope: 'all' },
      { module: 'projects', action: 'view', scope: 'assigned' },
      { module: 'projects', action: 'edit', scope: 'assigned' },
      { module: 'products', action: 'view', scope: 'all' },
      { module: 'products', action: 'edit', scope: 'all' },
      { module: 'eod', action: 'view', scope: 'team' },
      { module: 'eod', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'view', scope: 'team' },
      { module: 'attendance', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'approve', scope: 'team' },
      { module: 'reports', action: 'generate', scope: 'team' },
    ]);

    // 4. TL
    await mapRolePerms('TL', [
      { module: 'leads', action: 'view', scope: 'team' },
      { module: 'leads', action: 'edit', scope: 'team' },
      { module: 'leads', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'view', scope: 'team' },
      { module: 'tasks', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'edit', scope: 'team' },
      { module: 'tasks', action: 'assign', scope: 'all' },
      { module: 'projects', action: 'view', scope: 'assigned' },
      { module: 'projects', action: 'edit', scope: 'assigned' },
      { module: 'products', action: 'view', scope: 'all' },
      { module: 'eod', action: 'view', scope: 'team' },
      { module: 'eod', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'view', scope: 'team' },
      { module: 'attendance', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'approve', scope: 'team' },
      { module: 'reports', action: 'generate', scope: 'team' },
    ]);

    // 5. EMPLOYEE
    await mapRolePerms('EMPLOYEE', [
      { module: 'leads', action: 'view', scope: 'own' },
      { module: 'leads', action: 'edit', scope: 'own' },
      { module: 'leads', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'view', scope: 'own' },
      { module: 'tasks', action: 'edit', scope: 'own' },
      { module: 'projects', action: 'view', scope: 'assigned' },
      { module: 'products', action: 'view', scope: 'own' },
      { module: 'eod', action: 'view', scope: 'own' },
      { module: 'eod', action: 'create', scope: 'all' },
      { module: 'attendance', action: 'view', scope: 'own' },
      { module: 'attendance', action: 'create', scope: 'all' },
      { module: 'employees', action: 'view', scope: 'own' },
      { module: 'employees', action: 'edit', scope: 'own' },
      { module: 'reports', action: 'generate', scope: 'own' },
    ]);

    console.log('✅ Role mappings seeded');

    // 5. Create Super Admin User
    const adminEmail = 'superadmin@media-masala.com';
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    const adminDept = await prisma.department.findUnique({ where: { code: 'ADMIN' } });

    if (adminRole && adminDept) {
      const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash: hashedPassword },
        create: {
          email: adminEmail,
          passwordHash: hashedPassword,
          roleId: adminRole.id,
          departmentId: adminDept.id,
        },
      });

      console.log('✅ Super Admin user created/updated');

      await prisma.employee.upsert({
        where: { email: adminEmail },
        update: {
          firstName: 'Super',
          lastName: 'Admin',
          roleId: adminRole.id,
          departmentId: adminDept.id,
        },
        create: {
          empId: 'EMP001',
          userId: adminUser.id,
          firstName: 'Super',
          lastName: 'Admin',
          email: adminEmail,
          departmentId: adminDept.id,
          roleId: adminRole.id,
        },
      });
      console.log('✅ Super Admin employee record created/updated');
    }

    console.log('🚀 Seeding Complete: superadmin@media-masala.com / Password@123');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
