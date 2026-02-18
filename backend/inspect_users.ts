
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany({
    include: {
      user: true,
      department: true,
      role: true,
    },
    orderBy: {
      role: {
        name: 'asc'
      }
    }
  });

  console.log("--- CURRENT ACCOUNTS ---");
  console.log("| Name | Email | Role | Department |");
  console.log("|---|---|---|---|");
  employees.forEach(emp => {
    console.log(`| ${emp.firstName} ${emp.lastName} | ${emp.email} | ${emp.role.name} | ${emp.department?.name || 'N/A'} |`);
  });
  console.log("------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
