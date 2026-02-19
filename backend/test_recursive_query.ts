
import { PrismaClient } from '@prisma/client';
import { getRecursiveReporteeIds } from './src/utils/userUtils';

const prisma = new PrismaClient();

async function main() {
  console.log('=== TEST RECURSIVE REPORTIES QUERY ===');

  // Find Sales BM
  const bm = await prisma.employee.findUnique({
    where: { email: 'sales.bm@test.com' }
  });

  if (!bm) {
    console.error('❌ Sales BM "sales.bm@test.com" not found. Cannot test.');
    return;
  }

  console.log(`Testing for BM: ${bm.firstName} ${bm.lastName} (ID: ${bm.id})`);

  const startTime = Date.now();
  const reporteeIds = await getRecursiveReporteeIds(bm.id);
  const duration = Date.now() - startTime;

  console.log(`Query took ${duration}ms`);
  console.log(`Found ${reporteeIds.length} reportees.`);
  console.log('IDs:', reporteeIds);

  if (reporteeIds.length > 0) {
      console.log('✅ Query returned results.');
  } else {
      console.log('⚠️ Query returned empty array. Is this expected? (Should have BDMs and BDEs)');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
