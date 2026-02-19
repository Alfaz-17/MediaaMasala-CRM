import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function checkPerms() {
  const roles = await prisma.role.findMany({
    where: {
      code: { in: ['SALES_BM', 'PROD_PM', 'PROJ_PM', 'OPS_MGR', 'SALES_HEAD'] }
    },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });

  const report = roles.map(role => ({
    name: role.name,
    code: role.code,
    permissions: role.permissions.map(p => `${p.permission.module}:${p.permission.action}:${p.permission.scopeType}`),
    hasEmployeesView: role.permissions.some(p => p.permission.module === 'employees' && p.permission.action === 'view')
  }));

  fs.writeFileSync('perms_report.json', JSON.stringify(report, null, 2));
  console.log('Report generated: perms_report.json');
  await prisma.$disconnect();
}

checkPerms();
