import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- DEPARTMENTS ---');
  const depts = await prisma.department.findMany({ select: { id: true, name: true } });
  console.table(depts);

  console.log('\n--- EMPLOYEES & USERS ---');
  const emps = await prisma.employee.findMany({
    select: { 
      id: true, 
      firstName: true, 
      lastName: true, 
      email: true, 
      managerId: true,
      department: { select: { name: true } },
      role: { select: { name: true } }
    }
  });
  console.table(emps.map(e => ({
    id: e.id,
    name: `${e.firstName} ${e.lastName}`,
    email: e.email,
    dept: e.department.name,
    role: e.role.name,
    manager: e.managerId
  })));

  console.log('\n--- SAMPLE LEADS ---');
  const leads = await prisma.lead.findMany({
    take: 5,
    select: { id: true, name: true, status: true, ownerId: true }
  });
  console.table(leads);
}

main().finally(() => prisma.$disconnect());
