
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXPECTED_MATRIX: Record<string, Record<string, string[]>> = {
  SALES_HEAD: {
    employees: ['view:department'],
    leads: ['view:department', 'edit:department', 'create:all'],
    attendance: ['view:department', 'create:own'],
    eod: ['view:department', 'create:own'],
    tasks: ['view:department', 'edit:department', 'create:all'],
  },
  SALES_BM: {
    employees: ['view:team'],
    leads: ['view:team', 'edit:team', 'create:all'],
    attendance: ['view:team', 'create:own'],
    eod: ['view:team', 'create:own'],
    tasks: ['view:team', 'edit:team', 'create:all'],
  },
  SALES_BDM: {
    employees: ['view:team'],
    leads: ['view:team', 'edit:team', 'create:all'],
    attendance: ['view:team', 'create:own'],
    eod: ['view:team', 'create:own'],
    tasks: ['view:team', 'edit:team', 'create:all'],
  },
  SALES_BDE: {
    employees: ['view:own'],
    leads: ['view:own', 'edit:own'],
    attendance: ['view:own', 'create:own'],
    eod: ['view:own', 'create:own'],
    tasks: ['view:own', 'edit:own'],
  }
};

async function audit() {
  console.log('=== HIERARCHY PERMISSION AUDIT (DISCREPANCIES ONLY) ===');
  try {
    const roles = await prisma.role.findMany({
      where: { code: { in: Object.keys(EXPECTED_MATRIX) } },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });

    if (roles.length === 0) {
      console.log('No roles found matching the expected matrix.');
      return;
    }

    let discrepancyCount = 0;

    for (const roleCode of Object.keys(EXPECTED_MATRIX)) {
      const role = roles.find(r => r.code === roleCode);
      const expected = EXPECTED_MATRIX[roleCode];
      let roleHeaderPrinted = false;

      for (const [module, expectedActions] of Object.entries(expected)) {
        for (const expectedActionScope of expectedActions) {
          const [action, scope] = expectedActionScope.split(':');
          
          const matchingPerms = role?.permissions.filter(rp => 
            rp.permission.module === module && 
            rp.permission.action === action
          ) || [];

          let isOk = false;
          let actualScopes = matchingPerms.map(rp => rp.permission.scopeType);
          
          if (actualScopes.includes(scope)) {
            isOk = true;
          }

          if (!isOk) {
            if (!roleHeaderPrinted) {
              console.log(`\nROLE: ${roleCode}`);
              roleHeaderPrinted = true;
            }
            if (matchingPerms.length === 0) {
              console.log(`  [MISSING] ${module}:${action} (Expected: ${scope})`);
            } else {
              console.log(`  [WRONG] ${module}:${action} -> Expected ${scope}, Found: ${actualScopes.join(', ')}`);
            }
            discrepancyCount++;
          }
        }
      }
    }
    console.log(`\n=== AUDIT COMPLETE: ${discrepancyCount} DISCREPANCIES FOUND ===`);
  } catch (error) {
    console.error('Audit failed with error:', error);
  }
}

audit()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
