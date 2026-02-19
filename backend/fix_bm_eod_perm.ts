
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Applying Targeted Fix for SALES_BM EOD Permission ---');

  const roleBM = await prisma.role.findUnique({ where: { code: 'SALES_BM' } });
  if (!roleBM) {
    console.error('❌ SALES_BM role not found');
    return;
  }

  const p = { module: 'eod', action: 'create', scope: 'own' };
  
  const perm = await prisma.permission.findFirst({
    where: { module: p.module, action: p.action, scopeType: p.scope }
  });

  if (!perm) {
    console.error(`❌ Permission ${p.module}:${p.action}:${p.scope} not found in database.`);
    return;
  }

  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: roleBM.id, permissionId: perm.id } },
    update: {},
    create: { roleId: roleBM.id, permissionId: perm.id }
  });

  console.log('✅ SALES_BM granted eod:create:own');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
