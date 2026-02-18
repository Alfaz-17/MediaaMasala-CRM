
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany({
    where: {
      role: {
        name: {
          in: ['Admin', 'Department Head', 'Manager', 'Employee', 'Sales Manager', 'Sales Executive'] 
        }
      }
    },
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

  let output = "--- TEST ACCOUNTS ---\n";
  output += "| Name | Email | Role | Department |\n";
  output += "|---|---|---|---|\n";
  employees.forEach(emp => {
    output += `| ${emp.firstName} ${emp.lastName} | ${emp.email} | ${emp.role.name} | ${emp.department?.name || 'N/A'} |\n`;
  });
  output += "------------------------\n";

  fs.writeFileSync('test_accounts.txt', output);
  console.log("Accounts written to test_accounts.txt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
