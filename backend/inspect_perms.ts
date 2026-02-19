
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['SALES_BM', 'SALES_BDM'];
  
  for (const code of roles) {
    const role = await prisma.role.findUnique({
      where: { code },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    if (!role) {
      console.log(`Role ${code} not found`);
      continue;
    }

    const empPerms = role.permissions
      .map(rp => rp.permission)
      .filter(p => p.module === 'employees' || p.module === 'leads'); // Check leads too

    console.log(`Permissions for ${code}:`);
    empPerms.forEach(p => {
      console.log(`  Module: ${p.module}, Action: ${p.action}, Scope: ${p.scopeType}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
