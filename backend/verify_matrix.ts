import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySalesMatrix() {
  const roles = await prisma.role.findMany({
    where: {
      code: { in: ['SALES_HEAD', 'SALES_BM', 'SALES_BDM', 'SALES_BDE', 'ADMIN'] }
    },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });

  const matrix: any = {};

  for (const role of roles) {
    matrix[role.code] = {
      name: role.name,
      modules: {}
    };

    for (const rp of role.permissions) {
      const p = rp.permission;
      if (!matrix[role.code].modules[p.module]) {
        matrix[role.code].modules[p.module] = [];
      }
      matrix[role.code].modules[p.module].push(`${p.action}:${p.scopeType}`);
    }
  }

  console.log('--- Sales Permission Matrix Verification ---');
  
  const expectedScopes: any = {
    SALES_HEAD: { leads: 'department', tasks: 'department', eod: 'department', employees: 'department' },
    SALES_BM: { leads: 'team', tasks: 'team', eod: 'team', employees: 'team' },
    SALES_BDM: { leads: 'team', tasks: 'team', eod: 'team', employees: 'team' },
    SALES_BDE: { leads: 'own', tasks: 'own', eod: 'own', employees: 'own' },
    ADMIN: { leads: 'all', tasks: 'all', eod: 'all', employees: 'all' }
  };

  let allValid = true;

  for (const [roleCode, scopes] of Object.entries(expectedScopes)) {
    const roleData = matrix[roleCode];
    if (!roleData) {
      console.error(`❌ Role ${roleCode} not found in database!`);
      allValid = false;
      continue;
    }

    console.log(`\nVerifying Role: ${roleData.name} (${roleCode})`);
    
    for (const [module, expectedScope] of Object.entries(scopes as any)) {
      const modulePerms = roleData.modules[module] || [];
      const hasView = modulePerms.some((p: string) => p.startsWith('view:'));
      const activeScope = modulePerms.find((p: string) => p.startsWith('view:'))?.split(':')[1];

      if (!hasView) {
        console.error(`  ❌ Missing 'view' permission for module '${module}'`);
        allValid = false;
      } else if (activeScope !== expectedScope) {
        console.error(`  ❌ Incorrect scope for '${module}': expected '${expectedScope}', found '${activeScope}'`);
        allValid = false;
      } else {
        console.log(`  ✅ ${module}: ${activeScope}`);
      }
    }
  }

  if (allValid) {
    console.log('\n✨ ALL SALES PERMISSIONS ARE PERFECTLY ALIGNED WITH THE MATRIX! ✨');
  } else {
    console.log('\n⚠️ PERMISSION MATRIX MISMATCH DETECTED. PLEASE REVIEW LOGS. ⚠️');
  }

  await prisma.$disconnect();
}

verifySalesMatrix();
