import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkHierarchy() {
  const allEmployees = await prisma.employee.findMany({
    select: { id: true, firstName: true, managerId: true, role: { select: { name: true } } }
  });

  const getRecursive = (mId: number): number[] => {
    const subs = allEmployees.filter(e => e.managerId === mId);
    let ids = subs.map(s => s.id);
    for (const sub of subs) {
        ids = [...ids, ...getRecursive(sub.id)];
    }
    return ids;
  }

  const keyRoles = ['HOD', 'BM', 'BDM'];
  for (const roleName of keyRoles) {
    const managers = allEmployees.filter(e => e.role.name === roleName);
    for (const mgr of managers) {
        const reportees = getRecursive(mgr.id);
        console.log(`MGR: ${mgr.firstName} | ROLE: ${roleName} | REPORTEES: ${reportees.length}`);
    }
  }
  await prisma.$disconnect();
}
checkHierarchy().catch(console.error);
