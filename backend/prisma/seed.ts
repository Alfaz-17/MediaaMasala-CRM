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
      { name: 'Product Designer', code: 'PROD_DESIGNER', description: 'UI/UX Designer', departmentCode: 'PRODUCT' },

      // Project Department Roles
      { name: 'Project Head', code: 'PROJ_HEAD', description: 'Head of Project Department', departmentCode: 'PROJECT' },
      { name: 'Project Manager', code: 'PROJ_PM', description: 'Project Manager', departmentCode: 'PROJECT' },
      { name: 'Project Developer', code: 'PROJ_DEV', description: 'Developer', departmentCode: 'PROJECT' },
      { name: 'Project Tester', code: 'PROJ_TEST', description: 'Tester', departmentCode: 'PROJECT' },
      { name: 'Project Designer', code: 'PROJ_DESIGNER', description: 'UI/UX Designer', departmentCode: 'PROJECT' },

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
      { module: 'eod', action: 'create', scopeType: 'own' },
      
      // Attendance
      { module: 'attendance', action: 'view', scopeType: 'all' },
      { module: 'attendance', action: 'view', scopeType: 'department' },
      { module: 'attendance', action: 'view', scopeType: 'team' },
      { module: 'attendance', action: 'view', scopeType: 'own' },
      { module: 'attendance', action: 'create', scopeType: 'own' },
      { module: 'attendance', action: 'approve', scopeType: 'all' },
      { module: 'attendance', action: 'approve', scopeType: 'department' },
      { module: 'attendance', action: 'approve', scopeType: 'team' },
      
      // Employees
      { module: 'employees', action: 'view', scopeType: 'all' },
      { module: 'employees', action: 'view', scopeType: 'department' },
      { module: 'employees', action: 'view', scopeType: 'team' },
      { module: 'employees', action: 'view', scopeType: 'own' },
      { module: 'employees', action: 'manage', scopeType: 'all' },
      { module: 'employees', action: 'edit', scopeType: 'all' },
      { module: 'employees', action: 'edit', scopeType: 'department' },
      { module: 'employees', action: 'edit', scopeType: 'team' },
      { module: 'employees', action: 'edit', scopeType: 'own' },
      
      // Reports
      { module: 'reports', action: 'generate', scopeType: 'all' },
      { module: 'reports', action: 'generate', scopeType: 'department' },
      { module: 'reports', action: 'generate', scopeType: 'team' },
      { module: 'reports', action: 'generate', scopeType: 'own' },
      
      // Leaves
      { module: 'leaves', action: 'view', scopeType: 'all' },
      { module: 'leaves', action: 'view', scopeType: 'department' },
      { module: 'leaves', action: 'view', scopeType: 'team' },
      { module: 'leaves', action: 'view', scopeType: 'own' },
      { module: 'leaves', action: 'create', scopeType: 'own' },
      { module: 'leaves', action: 'edit', scopeType: 'own' },
      { module: 'leaves', action: 'delete', scopeType: 'own' },
      { module: 'leaves', action: 'approve', scopeType: 'all' },
      { module: 'leaves', action: 'approve', scopeType: 'department' },
      { module: 'leaves', action: 'approve', scopeType: 'team' },
    ];

    // Deduplicate permissions
    const uniquePermissions = Array.from(new Map(permissions.map(p => [`${p.module}-${p.action}-${p.scopeType}`, p])).values());

    console.log(`--- Seeding ${uniquePermissions.length} Unique Permissions ---`);
    await prisma.permission.createMany({
      data: uniquePermissions,
      skipDuplicates: true,
    });
    console.log('✅ Permissions seeded');

    // 4. Map Roles to Permissions
    console.log('--- Mapping Roles to Permissions ---');
    const allFetchedPerms = await prisma.permission.findMany();
    const rolePermMappings: { roleId: number; permissionId: number }[] = [];

    const getPermId = (module: string, action: string, scope: string) => {
      const p = allFetchedPerms.find(perm => perm.module === module && perm.action === action && perm.scopeType === scope);
      return p?.id;
    };

    const rolesInDb = await prisma.role.findMany();

    // Mapping logic
    for (const role of rolesInDb) {
      if (role.code === 'ADMIN') {
        for (const p of allFetchedPerms) {
          rolePermMappings.push({ roleId: role.id, permissionId: p.id });
        }
        continue;
      }

      const roleMappings: { module: string; action: string; scope: string }[] = [];

      // HEAD_DEPT roles
      if (['SALES_HEAD', 'PROD_HEAD', 'PROJ_HEAD', 'OPS_HEAD'].includes(role.code)) {
        roleMappings.push(
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
          { module: 'eod', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'view', scope: 'department' },
          { module: 'attendance', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'approve', scope: 'department' },
          { module: 'employees', action: 'view', scope: 'department' },
          { module: 'employees', action: 'edit', scope: 'department' },
          { module: 'reports', action: 'generate', scope: 'department' },
        );
      }

      // SALES_BM
      if (role.code === 'SALES_BM') {
        roleMappings.push(
          { module: 'leads', action: 'view', scope: 'team' },
          { module: 'leads', action: 'edit', scope: 'team' },
          { module: 'leads', action: 'create', scope: 'all' },
          { module: 'leads', action: 'assign', scope: 'all' },
          { module: 'tasks', action: 'view', scope: 'team' },
          { module: 'tasks', action: 'create', scope: 'all' },
          { module: 'tasks', action: 'edit', scope: 'team' },
          { module: 'tasks', action: 'assign', scope: 'all' },
          { module: 'eod', action: 'view', scope: 'team' },
          { module: 'eod', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'view', scope: 'team' },
          { module: 'attendance', action: 'create', scope: 'own' },
          { module: 'reports', action: 'generate', scope: 'team' },
          { module: 'employees', action: 'view', scope: 'team' },
        );
      }

      // SALES_BDM
      if (role.code === 'SALES_BDM') {
        roleMappings.push(
          { module: 'leads', action: 'view', scope: 'team' },
          { module: 'leads', action: 'edit', scope: 'team' },
          { module: 'leads', action: 'create', scope: 'all' },
          { module: 'leads', action: 'assign', scope: 'all' },
          { module: 'tasks', action: 'view', scope: 'team' },
          { module: 'tasks', action: 'create', scope: 'all' },
          { module: 'tasks', action: 'edit', scope: 'team' },
          { module: 'tasks', action: 'assign', scope: 'all' },
          { module: 'eod', action: 'view', scope: 'team' },
          { module: 'eod', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'view', scope: 'team' },
          { module: 'attendance', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'approve', scope: 'team' },
          { module: 'reports', action: 'generate', scope: 'team' },
          { module: 'employees', action: 'view', scope: 'team' },
          { module: 'projects', action: 'view', scope: 'department' },
        );
      }

      // PROD_PM / PROJ_PM (Project Managers)
      if (['PROD_PM', 'PROJ_PM'].includes(role.code)) {
        roleMappings.push(
          { module: 'tasks', action: 'view', scope: 'department' },
          { module: 'tasks', action: 'edit', scope: 'department' },
          { module: 'tasks', action: 'create', scope: 'all' },
          { module: 'projects', action: 'view', scope: 'department' },
          { module: 'projects', action: 'edit', scope: 'department' },
          { module: 'eod', action: 'view', scope: 'department' },
          { module: 'attendance', action: 'view', scope: 'department' },
          { module: 'employees', action: 'view', scope: 'department' },
          { module: 'reports', action: 'generate', scope: 'department' },
        );
      }

      // OPS_MGR (Operations Manager)
      if (role.code === 'OPS_MGR') {
        roleMappings.push(
          { module: 'attendance', action: 'view', scope: 'department' },
          { module: 'attendance', action: 'approve', scope: 'department' },
          { module: 'employees', action: 'view', scope: 'department' },
          { module: 'employees', action: 'manage', scope: 'all' },
          { module: 'eod', action: 'view', scope: 'department' },
          { module: 'reports', action: 'generate', scope: 'department' },
        );
      }

      // Basic Employee Roles
      if (['SALES_BDE', 'PROD_DEV', 'PROD_TEST', 'PROJ_DEV', 'PROJ_TEST', 'PROD_DESIGNER', 'PROJ_DESIGNER'].includes(role.code)) {
        roleMappings.push(
          { module: 'leads', action: 'view', scope: 'own' },
          { module: 'leads', action: 'edit', scope: 'own' },
          { module: 'tasks', action: 'view', scope: 'own' },
          { module: 'tasks', action: 'edit', scope: 'own' },
          { module: 'eod', action: 'view', scope: 'own' },
          { module: 'eod', action: 'create', scope: 'own' },
          { module: 'attendance', action: 'view', scope: 'own' },
          { module: 'attendance', action: 'create', scope: 'own' },
          { module: 'employees', action: 'view', scope: 'own' },
          { module: 'projects', action: 'view', scope: 'assigned' },
          { module: 'reports', action: 'generate', scope: 'own' },
        );
      }

      // Add Leaves to all relevant roles
      if (['SALES_HEAD', 'PROD_HEAD', 'PROJ_HEAD', 'OPS_HEAD'].includes(role.code)) {
        roleMappings.push(
          { module: 'leaves', action: 'view', scope: 'department' },
          { module: 'leaves', action: 'approve', scope: 'department' },
        );
      }

      if (['SALES_BM', 'SALES_BDM'].includes(role.code)) {
        roleMappings.push(
          { module: 'leaves', action: 'view', scope: 'team' },
          { module: 'leaves', action: 'approve', scope: 'team' },
        );
      }

      if (['PROD_PM', 'PROJ_PM'].includes(role.code)) {
        roleMappings.push(
          { module: 'leaves', action: 'view', scope: 'department' },
          { module: 'leaves', action: 'approve', scope: 'department' },
        );
      }

      if (role.code === 'OPS_MGR') {
        roleMappings.push(
          { module: 'leaves', action: 'view', scope: 'all' },
          { module: 'leaves', action: 'approve', scope: 'all' },
        );
      }

      // All employees (including the above) can manage their own leaves
      roleMappings.push(
        { module: 'leaves', action: 'view', scope: 'own' },
        { module: 'leaves', action: 'create', scope: 'own' },
        { module: 'leaves', action: 'edit', scope: 'own' },
        { module: 'leaves', action: 'delete', scope: 'own' },
      );

      for (const m of roleMappings) {
        const pId = getPermId(m.module, m.action, m.scope);
        if (pId) {
          rolePermMappings.push({ roleId: role.id, permissionId: pId });
        }
      }
    }

    // Batch insert role permissions
    await prisma.rolePermission.createMany({
      data: rolePermMappings,
      skipDuplicates: true,
    });
    console.log('✅ Role mappings seeded');

    // 5. Create Super Admin User
    const adminEmail = 'superadmin@media-masala.com';
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    const adminDept = await prisma.department.findUnique({ where: { code: 'ADMIN' } });
    const adminRole = rolesInDb.find(r => r.code === 'ADMIN');

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

      // 6. Create Sales Hierarchy (Orderly Construction)
      console.log('--- Seeding Sales Hierarchy ---');
      
      const createStaff = async (
        empId: string, firstName: string, lastName: string, 
        email: string, roleCode: string, deptCode: string, managerId?: number
      ) => {
        const d = await prisma.department.findUnique({ where: { code: deptCode } });
        const r = await prisma.role.findUnique({ where: { code: roleCode } });
        if (!d || !r) throw new Error(`Missing Dept ${deptCode} or Role ${roleCode}`);

        const user = await prisma.user.upsert({
          where: { email },
          update: { passwordHash: hashedPassword, roleId: r.id, departmentId: d.id },
          create: {
            email,
            passwordHash: hashedPassword,
            roleId: r.id,
            departmentId: d.id,
          }
        });

        const emp = await prisma.employee.upsert({
          where: { email },
          update: { 
            firstName, lastName, roleId: r.id, departmentId: d.id, 
            managerId: managerId ?? undefined 
          },
          create: {
            empId,
            userId: user.id,
            firstName,
            lastName,
            email,
            departmentId: d.id,
            roleId: r.id,
            managerId: managerId ?? undefined,
          }
        });
        return emp;
      };

      // Level 1: HOD
      const hod = await createStaff('EMP-HOD', 'Sales', 'HOD', 'sales.hod@test.com', 'SALES_HEAD', 'SALES');
      // Level 2: BM
      const bm = await createStaff('EMP-BM', 'Sales', 'BM', 'sales.bm@test.com', 'SALES_BM', 'SALES', hod.id);
      // Level 3: BDMs
      const bdm1 = await createStaff('EMP-BDM1', 'Sales', 'BDM-1', 'sales.bdm1@test.com', 'SALES_BDM', 'SALES', bm.id);
      const bdm2 = await createStaff('EMP-BDM2', 'Sales', 'BDM-2', 'sales.bdm2@test.com', 'SALES_BDM', 'SALES', bm.id);
      // Level 4: BDEs (Team 1)
      const bde1a = await createStaff('EMP-BDE1A', 'Sales', 'BDE-1A', 'sales.bde1a@test.com', 'SALES_BDE', 'SALES', bdm1.id);
      const bde1b = await createStaff('EMP-BDE1B', 'Sales', 'BDE-1B', 'sales.bde1b@test.com', 'SALES_BDE', 'SALES', bdm1.id);
      const bde1c = await createStaff('EMP-BDE1C', 'Sales', 'BDE-1C', 'sales.bde1c@test.com', 'SALES_BDE', 'SALES', bdm1.id);
      const bde1d = await createStaff('EMP-BDE1D', 'Sales', 'BDE-1D', 'sales.bde1d@test.com', 'SALES_BDE', 'SALES', bdm1.id);
      // Level 4: BDEs (Team 2)
      const bde2a = await createStaff('EMP-BDE2A', 'Sales', 'BDE-2A', 'sales.bde2a@test.com', 'SALES_BDE', 'SALES', bdm2.id);
      const bde2b = await createStaff('EMP-BDE2B', 'Sales', 'BDE-2B', 'sales.bde2b@test.com', 'SALES_BDE', 'SALES', bdm2.id);
      const bde2c = await createStaff('EMP-BDE2C', 'Sales', 'BDE-2C', 'sales.bde2c@test.com', 'SALES_BDE', 'SALES', bdm2.id);
      const bde2d = await createStaff('EMP-BDE2D', 'Sales', 'BDE-2D', 'sales.bde2d@test.com', 'SALES_BDE', 'SALES', bdm2.id);

      // Product Department Team (Full Hierarchy)
      const prodHod = await createStaff('EMP-PROD-HOD', 'Product', 'HOD', 'prod.hod@test.com', 'PROD_HEAD', 'PRODUCT');
      
      // Team 1
      const prodPM1 = await createStaff('EMP-PROD-PM1', 'Product', 'PM-1', 'prod.pm1@test.com', 'PROD_PM', 'PRODUCT', prodHod.id);
      await createStaff('EMP-PROD-DEV1', 'Product', 'Dev-1', 'prod.dev1@test.com', 'PROD_DEV', 'PRODUCT', prodPM1.id);
      await createStaff('EMP-PROD-TEST1', 'Product', 'Test-1', 'prod.test1@test.com', 'PROD_TEST', 'PRODUCT', prodPM1.id);
      await createStaff('EMP-PROD-DSN1', 'Product', 'Design-1', 'prod.design1@test.com', 'PROD_DESIGNER', 'PRODUCT', prodPM1.id);

      // Team 2
      const prodPM2 = await createStaff('EMP-PROD-PM2', 'Product', 'PM-2', 'prod.pm2@test.com', 'PROD_PM', 'PRODUCT', prodHod.id);
      await createStaff('EMP-PROD-DEV2', 'Product', 'Dev-2', 'prod.dev2@test.com', 'PROD_DEV', 'PRODUCT', prodPM2.id);
      await createStaff('EMP-PROD-TEST2', 'Product', 'Test-2', 'prod.test2@test.com', 'PROD_TEST', 'PRODUCT', prodPM2.id);
      await createStaff('EMP-PROD-DSN2', 'Product', 'Design-2', 'prod.design2@test.com', 'PROD_DESIGNER', 'PRODUCT', prodPM2.id);

      // Project Department Team (Full Hierarchy)
      const projHod = await createStaff('EMP-PROJ-HOD', 'Project', 'HOD', 'proj.hod@test.com', 'PROJ_HEAD', 'PROJECT');
      
      // Team 1
      const projPM1 = await createStaff('EMP-PROJ-PM1', 'Project', 'PM-1', 'proj.pm1@test.com', 'PROJ_PM', 'PROJECT', projHod.id);
      await createStaff('EMP-PROJ-DEV1', 'Project', 'Dev-1', 'proj.dev1@test.com', 'PROJ_DEV', 'PROJECT', projPM1.id);
      await createStaff('EMP-PROJ-TEST1', 'Project', 'Test-1', 'proj.test1@test.com', 'PROJ_TEST', 'PROJECT', projPM1.id);
      await createStaff('EMP-PROJ-DSN1', 'Project', 'Design-1', 'proj.design1@test.com', 'PROJ_DESIGNER', 'PROJECT', projPM1.id);

      // Team 2
      const projPM2 = await createStaff('EMP-PROJ-PM2', 'Project', 'PM-2', 'proj.pm2@test.com', 'PROJ_PM', 'PROJECT', projHod.id);
      await createStaff('EMP-PROJ-DEV2', 'Project', 'Dev-2', 'proj.dev2@test.com', 'PROJ_DEV', 'PROJECT', projPM2.id);
      await createStaff('EMP-PROJ-TEST2', 'Project', 'Test-2', 'proj.test2@test.com', 'PROJ_TEST', 'PROJECT', projPM2.id);
      await createStaff('EMP-PROJ-DSN2', 'Project', 'Design-2', 'proj.design2@test.com', 'PROJ_DESIGNER', 'PROJECT', projPM2.id);

      // Operations
      await createStaff('EMP-OPS1', 'Charlie', 'Ops', 'charlie.ops@media-masala.com', 'OPS_HEAD', 'OPERATION');

      console.log('✅ Sales hierarchy, Product team, Project team, and Ops staff created');

      // 7. Create Sample Leads (Detailed Hierarchy Leads)
      console.log('--- Seeding 80 Sample Leads ---');
      const salesDept = await prisma.department.findUnique({ where: { code: 'SALES' } });
      if (salesDept) {
        const bdes = [
          { emp: bde1a, tag: 'BDE1A' }, { emp: bde1b, tag: 'BDE1B' },
          { emp: bde1c, tag: 'BDE1C' }, { emp: bde1d, tag: 'BDE1D' },
          { emp: bde2a, tag: 'BDE2A' }, { emp: bde2b, tag: 'BDE2B' },
          { emp: bde2c, tag: 'BDE2C' }, { emp: bde2d, tag: 'BDE2D' }
        ];

        const sources = ['Website', 'Referral', 'Cold_Call', 'Email'];
        const statuses = ['New', 'Follow_Up', 'Prospect', 'Hot_Prospect', 'Proposal_Sent', 'Closing'];

        const leadData: any[] = [];
        for (const bde of bdes) {
          for (let i = 1; i <= 10; i++) {
            const leadName = `Lead-${bde.tag}-${i}`;
            const leadEmail = `${leadName.toLowerCase().replace(/ /g, '')}@example.com`;
            leadData.push({
              name: leadName,
              email: leadEmail,
              phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
              company: `Company ${bde.tag}-${i}`,
              source: sources[i % sources.length],
              status: statuses[i % statuses.length],
              ownerId: bde.emp.id,
              departmentId: salesDept.id,
              notes: `Test lead owned by ${bde.tag}`
            });
          }
        }

        await prisma.lead.createMany({
          data: leadData,
          skipDuplicates: true
        });
        console.log('✅ 80 Sample leads created/verified');
      }

      // 8. Create Sample Products (with Product Manager)
      console.log('--- Seeding Sample Products ---');
      const productSeedData = [
        { name: 'Standard Website', description: '<p>Responsive corporate website with up to <strong>5 pages</strong>. Includes contact form, SEO optimization, and mobile-first design.</p>', category: 'Web Development', productManagerId: prodPM1.id },
        { name: 'E-commerce Portal', description: '<p>Full-featured <strong>online store</strong> with payment integration, inventory management, and customer dashboard.</p><ul><li>Razorpay / Stripe</li><li>Admin panel</li><li>Order tracking</li></ul>', category: 'Web Development', productManagerId: prodPM2.id },
        { name: 'Mobile App Foundation', description: '<p>Base structure for <em>iOS and Android</em> mobile applications using <strong>React Native</strong>.</p>', category: 'Mobile Apps', productManagerId: prodPM1.id },
        { name: 'CRM System', description: '<p>Custom <strong>Customer Relationship Management</strong> system with lead tracking, task management, and reporting.</p>', category: 'SaaS', productManagerId: prodPM2.id },
        { name: 'Social Media Dashboard', description: '<p>Centralized dashboard for managing <strong>social media accounts</strong>, scheduling posts, and tracking analytics.</p>', category: 'SaaS', productManagerId: prodPM1.id },
      ];
      for (const p of productSeedData) {
        await (prisma.product as any).upsert({
          where: { name: p.name },
          update: { description: p.description, category: p.category, productManagerId: p.productManagerId },
          create: p
        });
      }
      console.log('✅ Sample products created with Product Manager assigned');

      // 9. Create Sample Projects (with RM and PM assignments)
      console.log('--- Seeding Sample Projects ---');
      const projectSeedData: any[] = [
        { name: 'Acme Website Redesign', description: '<p>Modernizing the <strong>corporate identity</strong> for Acme Corp. Full responsive redesign with new branding.</p>', status: 'Active', relationshipManagerId: bdm1.id, projectManagerId: projPM1.id },
        { name: 'Globex Mobile App', description: '<p>Developing a new <em>consumer application</em> for Globex Inc. React Native with backend API.</p>', status: 'Planning', relationshipManagerId: bdm2.id, projectManagerId: prodPM1.id },
        { name: 'TechNova CRM Integration', description: '<p>Building a custom <strong>CRM integration</strong> for TechNova, connecting their sales pipeline with inventory.</p>', status: 'Active', relationshipManagerId: bm.id, projectManagerId: projPM2.id },
      ];
      for (const pr of projectSeedData) {
        const exists = await prisma.project.findFirst({ where: { name: pr.name } });
        if (!exists) {
            await prisma.project.create({
                data: pr
            });
        }
      }
      console.log('✅ Sample projects created with RM + PM assigned');


      // 10. Create Sample Tasks
      console.log('--- Seeding Sample Tasks ---');
      const prodDev1 = await prisma.employee.findFirst({ where: { email: 'prod.dev1@test.com' } });
      if (prodDev1) {
        const taskTitle = 'Initial Product Setup';
        const exists = await prisma.task.findFirst({ where: { title: taskTitle } });
        if (!exists) {
            await prisma.task.create({
              data: {
                title: taskTitle,
                description: 'Set up the basic product catalog features.',
                dueDate: new Date(Date.now() + 86400000 * 7),
                priority: 'High',
                status: 'Pending',
                assigneeId: prodDev1.id,
                creatorId: prodDev1.id
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
