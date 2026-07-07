import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting System Seeding (Demo & Interview Ready) ---');

  try {
    const PASSWORD_HASH = await bcrypt.hash('Password@123', 10);
    const ADMIN_PASSWORD_HASH = await bcrypt.hash('mediaa@crm07', 10);

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

    // 1. Create Departments
    console.log('--- Creating Departments ---');
    const adminDept = await prisma.department.create({
      data: { name: 'Administration', code: 'ADMIN', description: 'Central Management' },
    });
    const salesDept = await prisma.department.create({
      data: { name: 'Sales Department', code: 'SALES', description: 'Lead Acquisition & Conversion' },
    });
    const productDept = await prisma.department.create({
      data: { name: 'Product Department', code: 'PRODUCT', description: 'Core Software Development' },
    });
    const projectDept = await prisma.department.create({
      data: { name: 'Project Department', code: 'PROJECT', description: 'Client Deliveries & Integration' },
    });
    const creativeDept = await prisma.department.create({
      data: { name: 'Creative Department', code: 'CREATIVE', description: 'Visual & UIUX Brand Design' },
    });
    const opsDept = await prisma.department.create({
      data: { name: 'Operations Department', code: 'OPS', description: 'System & CRM Operations' },
    });

    console.log('✅ Departments created');

    // 2. Create Roles
    console.log('--- Creating Roles ---');
    const roleAdmin = await prisma.role.create({
      data: { name: 'Admin', code: 'ADMIN', description: 'Full system control', departmentId: adminDept.id },
    });
    const roleSalesHOD = await prisma.role.create({
      data: { name: 'Head Of Department', code: 'SALES_HEAD', description: 'Sales Dept Management', departmentId: salesDept.id },
    });
    const roleSalesBM = await prisma.role.create({
      data: { name: 'Business Manager', code: 'SALES_BM', description: 'Sales Office Management', departmentId: salesDept.id },
    });
    const roleSalesBDM = await prisma.role.create({
      data: { name: 'Business Development Manager', code: 'SALES_BDM', description: 'Team Lead for Sales Execs', departmentId: salesDept.id },
    });
    const roleSalesBDE = await prisma.role.create({
      data: { name: 'Business Development Executive', code: 'SALES_BDE', description: 'Core Sales Representative', departmentId: salesDept.id },
    });
    const roleSalesRM = await prisma.role.create({
      data: { name: 'Relationship Manager', code: 'SALES_RM', description: 'Client Account Manager', departmentId: salesDept.id },
    });

    const roleProdHOD = await prisma.role.create({
      data: { name: 'Head Of Product', code: 'PROD_HEAD', description: 'Product Lifecycle Owner', departmentId: productDept.id },
    });
    const roleProdPM = await prisma.role.create({
      data: { name: 'Product Manager', code: 'PROD_PM', description: 'Product Roadmap Owner', departmentId: productDept.id },
    });
    const roleProdDev = await prisma.role.create({
      data: { name: 'Product Developer', code: 'PROD_DEV', description: 'Software Development', departmentId: productDept.id },
    });

    const roleProjHOD = await prisma.role.create({
      data: { name: 'Head Of Project', code: 'PROJ_HEAD', description: 'Project Portfolio Director', departmentId: projectDept.id },
    });
    const roleProjPM = await prisma.role.create({
      data: { name: 'Project Manager', code: 'PROJ_PM', description: 'Client Project Delivery Lead', departmentId: projectDept.id },
    });

    const roleCreativeHOD = await prisma.role.create({
      data: { name: 'Head Of Creative', code: 'HOD_CREATIVE', description: 'Design Standards Director', departmentId: creativeDept.id },
    });
    const roleUIUX = await prisma.role.create({
      data: { name: 'UIUX Designer', code: 'UIUX', description: 'Interface & User Experience', departmentId: creativeDept.id },
    });
    const roleUIUXIntern = await prisma.role.create({
      data: { name: 'UIUX Intern', code: 'UIUX_INTRN', description: 'Junior Designer', departmentId: creativeDept.id },
    });

    const roleHRM = await prisma.role.create({
      data: { name: 'HR Manager', code: 'HRM', description: 'Staffing & Leave Administrator', departmentId: adminDept.id },
    });
    const roleOpsHead = await prisma.role.create({
      data: { name: 'Operations Manager', code: 'OM', description: 'Infrastructure Management', departmentId: opsDept.id },
    });

    console.log('✅ Roles created');

    // 3. Create Permissions System
    console.log('--- Seeding Granular Permissions ---');
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

    const scopes = ['own', 'team', 'department', 'all', 'assigned'];
    const permissions: any[] = [];
    for (const [module, actions] of Object.entries(moduleActionMap)) {
      for (const action of actions) {
        for (const scopeType of scopes) {
          permissions.push({ module, action, scopeType });
        }
      }
    }

    await prisma.permission.createMany({ data: permissions, skipDuplicates: true });
    const allPerms = await prisma.permission.findMany();
    console.log(`✅ ${allPerms.length} permissions generated`);

    // 4. Map Permissions to Roles
    console.log('--- Mapping Permissions to Roles ---');
    // Admin gets everything
    await prisma.rolePermission.createMany({
      data: allPerms.map(p => ({ roleId: roleAdmin.id, permissionId: p.id })),
    });

    // Helper to map specific permissions to a role
    const mapPermissionsToRole = async (roleId: number, rules: { module: string, action: string, scopeType: string }[]) => {
      const rolePermData = [];
      for (const rule of rules) {
        const found = allPerms.find(p => p.module === rule.module && p.action === rule.action && p.scopeType === rule.scopeType);
        if (found) {
          rolePermData.push({ roleId, permissionId: found.id });
        }
      }
      if (rolePermData.length > 0) {
        await prisma.rolePermission.createMany({ data: rolePermData, skipDuplicates: true });
      }
    };

    // Sales HOD (Department scope)
    await mapPermissionsToRole(roleSalesHOD.id, [
      { module: 'leads', action: 'view', scopeType: 'department' },
      { module: 'leads', action: 'edit', scopeType: 'department' },
      { module: 'leads', action: 'create', scopeType: 'department' },
      { module: 'leads', action: 'assign', scopeType: 'department' },
      { module: 'tasks', action: 'view', scopeType: 'department' },
      { module: 'tasks', action: 'create', scopeType: 'department' },
      { module: 'tasks', action: 'edit', scopeType: 'department' },
      { module: 'tasks', action: 'assign', scopeType: 'department' },
      { module: 'attendance', action: 'view', scopeType: 'department' },
      { module: 'leaves', action: 'view', scopeType: 'department' },
      { module: 'leaves', action: 'approve', scopeType: 'department' },
      { module: 'eod', action: 'view', scopeType: 'department' },
      { module: 'reports', action: 'view', scopeType: 'department' },
      { module: 'reports', action: 'generate', scopeType: 'department' },
      { module: 'employees', action: 'view', scopeType: 'department' },
      { module: 'dashboard', action: 'view', scopeType: 'all' },
    ]);

    // Sales BM / BDM (Team scope)
    const teamLeaderPerms = [
      { module: 'leads', action: 'view', scopeType: 'team' },
      { module: 'leads', action: 'edit', scopeType: 'team' },
      { module: 'leads', action: 'create', scopeType: 'all' },
      { module: 'leads', action: 'assign', scopeType: 'all' },
      { module: 'tasks', action: 'view', scopeType: 'team' },
      { module: 'tasks', action: 'create', scopeType: 'all' },
      { module: 'tasks', action: 'edit', scopeType: 'team' },
      { module: 'tasks', action: 'assign', scopeType: 'all' },
      { module: 'attendance', action: 'view', scopeType: 'team' },
      { module: 'attendance', action: 'create', scopeType: 'own' },
      { module: 'attendance', action: 'approve', scopeType: 'team' },
      { module: 'leaves', action: 'view', scopeType: 'team' },
      { module: 'leaves', action: 'create', scopeType: 'own' },
      { module: 'leaves', action: 'approve', scopeType: 'team' },
      { module: 'eod', action: 'view', scopeType: 'team' },
      { module: 'eod', action: 'create', scopeType: 'own' },
      { module: 'reports', action: 'generate', scopeType: 'team' },
      { module: 'employees', action: 'view', scopeType: 'team' },
      { module: 'projects', action: 'view', scopeType: 'department' },
      { module: 'dashboard', action: 'view', scopeType: 'all' },
    ];
    await mapPermissionsToRole(roleSalesBM.id, teamLeaderPerms);
    await mapPermissionsToRole(roleSalesBDM.id, teamLeaderPerms);

    // Sales BDE (Own scope)
    const execPerms = [
      { module: 'leads', action: 'view', scopeType: 'own' },
      { module: 'leads', action: 'create', scopeType: 'own' },
      { module: 'leads', action: 'edit', scopeType: 'own' },
      { module: 'tasks', action: 'view', scopeType: 'own' },
      { module: 'tasks', action: 'create', scopeType: 'own' },
      { module: 'tasks', action: 'edit', scopeType: 'own' },
      { module: 'attendance', action: 'view', scopeType: 'own' },
      { module: 'attendance', action: 'create', scopeType: 'own' },
      { module: 'leaves', action: 'view', scopeType: 'own' },
      { module: 'leaves', action: 'create', scopeType: 'own' },
      { module: 'eod', action: 'view', scopeType: 'own' },
      { module: 'eod', action: 'create', scopeType: 'own' },
      { module: 'reports', action: 'generate', scopeType: 'own' },
      { module: 'employees', action: 'view', scopeType: 'own' },
      { module: 'projects', action: 'view', scopeType: 'assigned' },
      { module: 'dashboard', action: 'view', scopeType: 'all' },
    ];
    await mapPermissionsToRole(roleSalesBDE.id, execPerms);
    await mapPermissionsToRole(roleSalesRM.id, execPerms);
    await mapPermissionsToRole(roleProdDev.id, execPerms);
    await mapPermissionsToRole(roleUIUX.id, execPerms);
    await mapPermissionsToRole(roleUIUXIntern.id, execPerms);

    console.log('✅ Permissions mapped to roles');

    // 5. Helper to Create Users & Employees
    const createStaff = async (
      empId: string, firstName: string, lastName: string,
      email: string, roleId: number, departmentId: number,
      managerId?: number, isSuperAdmin: boolean = false
    ) => {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: isSuperAdmin && email === 'mediaamasala@gmail.com' ? ADMIN_PASSWORD_HASH : PASSWORD_HASH,
        },
      });

      const emp = await prisma.employee.create({
        data: {
          empId,
          userId: user.id,
          firstName,
          lastName,
          email,
          departmentId,
          roleId,
          managerId: managerId ?? undefined,
        },
      });

      console.log(`   👤 ${firstName} ${lastName} (${email})`);
      return emp;
    };

    // 6. Create Users & Hierarchy
    console.log('--- Creating Seed Accounts ---');

    // 6.1 Global Admins
    const adminEmp1 = await createStaff('EMP000', 'Super', 'Admin', 'superadmin@media-masala.com', roleAdmin.id, adminDept.id);
    const adminEmp2 = await createStaff('EMP001', 'Mediaa', 'Masala', 'mediaamasala@gmail.com', roleAdmin.id, adminDept.id, undefined, true);

    // 6.2 Sales Department Hierarchy
    console.log('  Building Sales Hierarchy...');
    const salesHOD = await createStaff('EMP010', 'Sales', 'HOD', 'sales.hod@test.com', roleSalesHOD.id, salesDept.id);
    const salesBM = await createStaff('EMP011', 'Sales', 'BranchManager', 'sales.bm@test.com', roleSalesBM.id, salesDept.id, salesHOD.id);
    const salesBDM1 = await createStaff('EMP012', 'Sales', 'BDM-1', 'sales.bdm1@test.com', roleSalesBDM.id, salesDept.id, salesBM.id);
    const salesBDM2 = await createStaff('EMP013', 'Sales', 'BDM-2', 'sales.bdm2@test.com', roleSalesBDM.id, salesDept.id, salesBM.id);

    const bde1a = await createStaff('EMP014', 'Sales', 'BDE-1A', 'sales.bde1a@test.com', roleSalesBDE.id, salesDept.id, salesBDM1.id);
    const bde1b = await createStaff('EMP015', 'Sales', 'BDE-1B', 'sales.bde1b@test.com', roleSalesBDE.id, salesDept.id, salesBDM1.id);
    const bde1c = await createStaff('EMP016', 'Sales', 'BDE-1C', 'sales.bde1c@test.com', roleSalesBDE.id, salesDept.id, salesBDM1.id);
    const bde1d = await createStaff('EMP017', 'Sales', 'BDE-1D', 'sales.bde1d@test.com', roleSalesBDE.id, salesDept.id, salesBDM1.id);

    const bde2a = await createStaff('EMP018', 'Sales', 'BDE-2A', 'sales.bde2a@test.com', roleSalesBDE.id, salesDept.id, salesBDM2.id);
    const bde2b = await createStaff('EMP019', 'Sales', 'BDE-2B', 'sales.bde2b@test.com', roleSalesBDE.id, salesDept.id, salesBDM2.id);
    const bde2c = await createStaff('EMP020', 'Sales', 'BDE-2C', 'sales.bde2c@test.com', roleSalesBDE.id, salesDept.id, salesBDM2.id);
    const bde2d = await createStaff('EMP021', 'Sales', 'BDE-2D', 'sales.bde2d@test.com', roleSalesBDE.id, salesDept.id, salesBDM2.id);

    const salesRM = await createStaff('EMP022', 'Sales', 'RelManager', 'kiranchoudhary5931@gmail.com', roleSalesRM.id, salesDept.id, salesBM.id);
    const bdeDemo = await createStaff('EMP023', 'Sales', 'BDE-Demo', 'darshraj@gmail.com', roleSalesBDE.id, salesDept.id, salesBDM1.id);

    // 6.3 Product Department
    console.log('  Building Product Hierarchy...');
    const prodHOD = await createStaff('EMP030', 'Product', 'HOD', 'prod.hod@test.com', roleProdHOD.id, productDept.id);
    const prodPM = await createStaff('EMP031', 'Product', 'PM', 'bhargavmg@gmail.com', roleProdPM.id, productDept.id, prodHOD.id);
    const prodDev = await createStaff('EMP032', 'Product', 'Dev', 'alfazb@gmail.com', roleProdDev.id, productDept.id, prodPM.id);

    // 6.4 Creative Department
    console.log('  Building Creative Hierarchy...');
    const creativeHOD = await createStaff('EMP040', 'Creative', 'HOD', 'krishishah@gmail.com', roleCreativeHOD.id, creativeDept.id);
    const creativeDesigner1 = await createStaff('EMP041', 'Creative', 'Designer1', 'danish@gmail.com', roleUIUX.id, creativeDept.id, creativeHOD.id);
    const creativeIntern1 = await createStaff('EMP042', 'Creative', 'Intern1', 'dadhaniyaaneri@gmail.com', roleUIUXIntern.id, creativeDept.id, creativeHOD.id);

    // 6.5 HR and Operations
    console.log('  Building HR & Operations...');
    const hrManager = await createStaff('EMP050', 'HR', 'Manager', 'raviparmar11102001@gmail.com', roleHRM.id, adminDept.id);
    const opsManager = await createStaff('EMP060', 'Operations', 'Manager', 'rpdesigner36@gmail.com', roleOpsHead.id, opsDept.id);

    // 6.6 Project Department
    console.log('  Building Project Hierarchy...');
    const projHOD = await createStaff('EMP070', 'Project', 'HOD', 'proj.hod@test.com', roleProjHOD.id, projectDept.id);
    const projPM = await createStaff('EMP071', 'Project', 'PM', 'jaiswaltanu1705@gmail.com', roleProjPM.id, projectDept.id, projHOD.id);

    console.log('✅ All accounts created');

    // 7. Seed Demo Leads (10 leads per BDE under Sales BDM-1)
    console.log('--- Seeding Demo Leads ---');
    const bdes = [bde1a, bde1b, bde1c, bde1d, bdeDemo];
    const sources: ('Website' | 'Referral' | 'Cold_Call' | 'Email')[] = ['Website', 'Referral', 'Cold_Call', 'Email'];
    const statuses: ('New' | 'Follow_Up' | 'Prospect' | 'Hot_Prospect' | 'Proposal_Sent' | 'Closing' | 'Won' | 'Lost')[] = [
      'New', 'Follow_Up', 'Prospect', 'Hot_Prospect', 'Proposal_Sent', 'Closing'
    ];

    let leadCount = 0;
    for (const bde of bdes) {
      for (let i = 1; i <= 10; i++) {
        const leadName = `Lead-${bde.firstName}-${String(i).padStart(2, '0')}`;
        await prisma.lead.create({
          data: {
            name: leadName,
            email: `${leadName.toLowerCase()}@example.com`,
            phone: `99${String(leadCount + 1).padStart(8, '0')}`,
            company: `Client Company ${bde.firstName} ${i}`,
            source: sources[i % sources.length],
            status: statuses[i % statuses.length],
            ownerId: bde.id,
            departmentId: salesDept.id,
            notes: `Auto-generated demo lead owned by ${bde.firstName} ${bde.lastName}`,
          },
        });
        leadCount++;
      }
    }
    console.log(`✅ Seeded ${leadCount} demo leads`);

    // 8. Seed Demo Products
    console.log('--- Seeding Demo Products ---');
    await prisma.product.createMany({
      data: [
        { name: 'Media Box Standard', price: 999, category: 'Hardware', status: 'Active' },
        { name: 'Media CRM Premium License', price: 149, category: 'SaaS', status: 'Active' },
        { name: 'Box Booking App integration', price: 499, category: 'Service', status: 'Active' },
      ],
    });
    console.log('✅ Seeded products');

    console.log('\n🚀 ALL DEMO SEED DATA IS FULLY DEPLOYED TO NEON! 🚀');
    console.log('   Admin: mediaamasala@gmail.com / mediaa@crm07');
    console.log('   SuperAdmin: superadmin@media-masala.com / Password@123');
    console.log('   All other test accounts password: Password@123');

  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
