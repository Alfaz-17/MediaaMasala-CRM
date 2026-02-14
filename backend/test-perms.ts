import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const perms = await prisma.permission.findMany({ take: 1 });
    console.log('Permission sample:', JSON.stringify(perms, null, 2));
    
    // Test a single upsert
    const testPerm = { module: 'test', action: 'test', scopeType: 'test' };
    await prisma.permission.upsert({
      where: {
        module_action_scopeType: {
          module: 'test',
          action: 'test',
          scopeType: 'test',
        }
      },
      update: {},
      create: testPerm
    });
    console.log('Test upsert success');
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
