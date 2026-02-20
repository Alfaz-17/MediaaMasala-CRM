import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('--- Verifying Product Department Hierarchy ---');

  const prodDept = await prisma.department.findUnique({
    where: { code: 'PRODUCT' },
    include: {
      employees: {
        include: {
          role: true,
          manager: true,
        },
      },
    },
  });

  if (!prodDept) {
    console.error('❌ Product Department not found!');
    return;
  }

  console.log(`Department: ${prodDept.name}`);
  console.log('Employees:');
  
  prodDept.employees.forEach(emp => {
    const managerName = emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : 'None';
    console.log(`- ${emp.firstName} ${emp.lastName} (${emp.role.name}) | Manager: ${managerName}`);
  });

  const products = await prisma.product.findMany({
    include: { productManager: true }
  });
  console.log('\nProducts:');
  products.forEach(p => {
    console.log(`- ${p.name} | PM: ${p.productManager?.firstName ?? 'N/A'}`);
  });

  await prisma.$disconnect();
}

verify();
