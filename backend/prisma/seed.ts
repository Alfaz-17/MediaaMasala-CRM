import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting System Seeding ---');

  try {
    // 0. Cleanup existing data to avoid unique constraint issues
    console.log('--- Cleaning up existing data (Orderly Destruction) ---');
    
    // Most dependent first
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
    await prisma.employee.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.department.deleteMany({});
    
    console.log('✅ Cleanup complete');

    // 1. Create Initial Departments
    const departments = [
      { name: 'Administration', code: 'ADMIN', description: 'Central Management' },
      { name: 'Sales Department', code: 'SALES', description: 'Lead generation and sales' },
      { name: 'Product Department', code: 'PRODUCT', description: 'Tech and product development' },
      { name: 'Project Department', code: 'PROJECT', description: 'Project management and execution' },
      { name: 'Operation Department', code: 'OPERATION', description: 'Operations and HR' },
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
      { name: 'Admin', code: 'ADMIN', description: 'Full system control', departmentCode: 'ADMIN' },
      
      // Sales Department Roles
      { name: 'Sales Head', code: 'SALES_HEAD', description: 'Head of Sales Department', departmentCode: 'SALES' },
      { name: 'Sales BM', code: 'SALES_BM', description: 'Business Manager', departmentCode: 'SALES' },
      { name: 'Sales BDM', code: 'SALES_BDM', description: 'Business Development Manager', departmentCode: 'SALES' },
      { name: 'Sales BDE', code: 'SALES_BDE', description: 'Business Development Executive', departmentCode: 'SALES' },
      
      // Product Department Roles
      { name: 'Product Head', code: 'PROD_HEAD', description: 'Head of Product Department', departmentCode: 'PRODUCT' },
      { name: 'Product Manager', code: 'PROD_PM', description: 'Product Manager', departmentCode: 'PRODUCT' },
      { name: 'Product Developer', code: 'PROD_DEV', description: 'Software Developer', departmentCode: 'PRODUCT' },
      { name: 'Product Tester', code: 'PROD_TEST', description: 'QA Tester', departmentCode: 'PRODUCT' },

      // Project Department Roles
      { name: 'Project Head', code: 'PROJ_HEAD', description: 'Head of Project Department', departmentCode: 'PROJECT' },
      { name: 'Project Manager', code: 'PROJ_PM', description: 'Project Manager', departmentCode: 'PROJECT' },
      { name: 'Project Developer', code: 'PROJ_DEV', description: 'Developer', departmentCode: 'PROJECT' },
      { name: 'Project Tester', code: 'PROJ_TEST', description: 'Tester', departmentCode: 'PROJECT' },

      // Operation Department Roles
      { name: 'Operations Head', code: 'OPS_HEAD', description: 'Head of Operations', departmentCode: 'OPERATION' },
      { name: 'Operation Manager', code: 'OPS_MGR', description: 'Operations Manager', departmentCode: 'OPERATION' },
    ];

    for (const role of roles) {
      const dept = await prisma.department.findUnique({ where: { code: role.departmentCode } });
      await prisma.role.upsert({
        where: { code: role.code },
        update: { 
          name: role.name, 
          description: role.description,
          departmentId: dept?.id 
        },
        create: { 
          name: role.name, 
          code: role.code, 
          description: role.description,
          departmentId: dept?.id
        },
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

    // Deduplicate permissions
    const uniquePermissions = Array.from(new Map(permissions.map(p => [`${p.module}-${p.action}-${p.scopeType}`, p])).values());

    console.log(`--- Seeding ${uniquePermissions.length} Unique Permissions ---`);
    for (const perm of uniquePermissions) {
      try {
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
      } catch (err) {
        console.error(`❌ Failed to seed permission: ${perm.module}:${perm.action}:${perm.scopeType}`, err);
        throw err;
      }
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

    // 2. HEAD_DEPT (Generic mapping for all Head of Dept roles)
    const headDeptRoles = ['SALES_HEAD', 'PROD_HEAD', 'PROJ_HEAD', 'OPS_HEAD'];
    for (const roleCode of headDeptRoles) {
      await mapRolePerms(roleCode, [
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
    }

    // 3. BM/PM/Other Roles (Example mappings)
    await mapRolePerms('SALES_BM', [
      { module: 'leads', action: 'view', scope: 'team' },
      { module: 'leads', action: 'edit', scope: 'team' },
      { module: 'leads', action: 'create', scope: 'all' },
      { module: 'leads', action: 'assign', scope: 'all' },
      { module: 'tasks', action: 'view', scope: 'team' },
      { module: 'tasks', action: 'create', scope: 'all' },
      { module: 'tasks', action: 'edit', scope: 'team' },
      { module: 'tasks', action: 'assign', scope: 'all' },
      { module: 'eod', action: 'view', scope: 'team' },
      { module: 'attendance', action: 'view', scope: 'team' },
      { module: 'reports', action: 'generate', scope: 'team' },
    ]);

    await mapRolePerms('PROD_PM', [
      { module: 'tasks', action: 'view', scope: 'department' },
      { module: 'tasks', action: 'edit', scope: 'department' },
      { module: 'projects', action: 'view', scope: 'department' },
      { module: 'projects', action: 'edit', scope: 'department' },
      { module: 'eod', action: 'view', scope: 'department' },
    ]);

    // 4. Basic Employee Roles (Dev, BDE, etc.)
    const basicEmployeeRoles = ['SALES_BDE', 'PROD_DEV', 'PROD_TEST', 'PROJ_DEV', 'PROJ_TEST'];
    for (const roleCode of basicEmployeeRoles) {
      await mapRolePerms(roleCode, [
        { module: 'leads', action: 'view', scope: 'own' },
        { module: 'leads', action: 'edit', scope: 'own' },
        { module: 'tasks', action: 'view', scope: 'own' },
        { module: 'tasks', action: 'edit', scope: 'own' },
        { module: 'eod', action: 'create', scope: 'all' },
        { module: 'attendance', action: 'create', scope: 'all' },
      ]);
    }

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

      // 6. Create Initial Employees for each Dept
      const sampleStaff = [
        { first: 'John', last: 'Sales', email: 'john.sales@media-masala.com', dept: 'SALES', role: 'SALES_HEAD' },
        { first: 'Jane', last: 'BM', email: 'jane.bm@media-masala.com', dept: 'SALES', role: 'SALES_BM' },
        { first: 'Alice', last: 'Product', email: 'alice.prod@media-masala.com', dept: 'PRODUCT', role: 'PROD_HEAD' },
        { first: 'Dev', last: 'One', email: 'dev1@media-masala.com', dept: 'PRODUCT', role: 'PROD_DEV' },
        { first: 'Bob', last: 'Project', email: 'bob.proj@media-masala.com', dept: 'PROJECT', role: 'PROJ_HEAD' },
        { first: 'Charlie', last: 'Ops', email: 'charlie.ops@media-masala.com', dept: 'OPERATION', role: 'OPS_HEAD' },
      ];

      for (const s of sampleStaff) {
        const d = await prisma.department.findUnique({ where: { code: s.dept } });
        const r = await prisma.role.findUnique({ where: { code: s.role } });
        if (d && r) {
          const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
              email: s.email,
              passwordHash: hashedPassword,
              roleId: r.id,
              departmentId: d.id,
            }
          });
          await prisma.employee.upsert({
            where: { email: s.email },
            update: {},
            create: {
              empId: `EMP-${s.email.split('@')[0].toUpperCase()}`,
              userId: user.id,
              firstName: s.first,
              lastName: s.last,
              email: s.email,
              departmentId: d.id,
              roleId: r.id,
            }
          });
        }
      }
      console.log('✅ Sample employees created');

      // 7. Create Sample Leads (Sales Flow)
      console.log('--- Seeding Sample Leads ---');
      const salesHead = await prisma.employee.findFirst({ where: { email: 'john.sales@media-masala.com' } });
      const salesDept = await prisma.department.findUnique({ where: { code: 'SALES' } });
      if (salesHead && salesDept) {
        const leadData = [
          { name: 'Acme Corp', email: 'contact@acme.com', phone: '1234567890', company: 'Acme Corp', source: 'Website' as any, status: 'New' as any },
          { name: 'Globex', email: 'info@globex.com', phone: '0987654321', company: 'Globex Inc', source: 'Referral' as any, status: 'Prospect' as any },
        ];
        for (const l of leadData) {
          const existingLead = await prisma.lead.findFirst({ where: { email: l.email } });
          if (!existingLead) {
            await prisma.lead.create({
              data: {
                ...l,
                ownerId: salesHead.id,
                departmentId: salesDept.id
              }
            });
          }
        }
        console.log('✅ Sample leads created/verified');
      }

      // 8. Create Sample Tasks
      console.log('--- Seeding Sample Tasks ---');
      const dev1 = await prisma.employee.findFirst({ where: { email: 'dev1@media-masala.com' } });
      if (dev1) {
        const existingTask = await prisma.task.findFirst({ where: { title: 'Initial Product Setup' } });
        if (!existingTask) {
          await prisma.task.create({
            data: {
              title: 'Initial Product Setup',
              description: 'Set up the basic product catalog features.',
              dueDate: new Date(Date.now() + 86400000 * 7),
              priority: 'High',
              status: 'Pending',
              assigneeId: dev1.id,
              creatorId: dev1.id
            }
          });
        }
        console.log('✅ Sample tasks created/verified');
      }
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
