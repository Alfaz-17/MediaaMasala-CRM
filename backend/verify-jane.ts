import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const jane = await prisma.employee.findFirst({ where: { email: 'jane.bm@media-masala.com' }, include: { role: { include: { permissions: { include: { permission: true } } } } } });
  if (!jane) {
    console.log('Jane BM not found');
    return;
  }

  console.log(`Jane ID: ${jane.id}`);
  console.log(`Jane Role: ${jane.role.code}`);
  
  const leadPerm = jane.role.permissions.find(p => p.permission.module === 'leads' && p.permission.action === 'view');
  console.log(`Lead View Scope in DB: ${leadPerm?.permission.scopeType}`);

  const reportees = await prisma.employee.findMany({ where: { managerId: jane.id } });
  console.log(`Jane reportees count: ${reportees.length}`);
  console.log(`Jane reportee IDs: ${reportees.map(r => r.id)}`);

  const allLeads = await prisma.lead.findMany();
  console.log(`Total leads in DB: ${allLeads.length}`);
  allLeads.forEach(l => {
    console.log(`Lead: ${l.name}, OwnerID: ${l.ownerId}, DeptID: ${l.departmentId}`);
  });
}

main().finally(() => prisma.$disconnect());
