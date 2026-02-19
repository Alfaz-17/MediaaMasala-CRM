import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const userCount = await prisma.user.count();
    const empCount = await prisma.employee.count();
    const leadCount = await prisma.lead.count();
    const roleCount = await prisma.role.count();
    const rolePermCount = await prisma.rolePermission.count();
    
    console.log(`Users: ${userCount}`);
    console.log(`Employees: ${empCount}`);
    console.log(`Leads: ${leadCount}`);
    console.log(`Roles: ${roleCount}`);
    console.log(`RolePermissions: ${rolePermCount}`);

    const users = await prisma.user.findMany({ select: { email: true } });
    console.log('Users in DB:');
    users.forEach(u => console.log(` - ${u.email}`));

    const hod = await prisma.user.findUnique({ where: { email: 'sales.hod@test.com' } });
    console.log(`HOD User exists: ${!!hod}`);
  } catch (error) {
    console.error('Prisma Error:', JSON.stringify(error, null, 2));
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
