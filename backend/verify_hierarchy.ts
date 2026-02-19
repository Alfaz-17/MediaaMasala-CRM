import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkHierarchy() {
  console.log("--- Checking Employee Hierarchy ---");
  
  // 1. Get total employees
  const totalEmployees = await prisma.employee.count();
  console.log(`Total Employees: ${totalEmployees}`);

  // 2. Build Hierarchy Manually
  const allEmployees = await prisma.employee.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      managerId: true,
      role: { select: { name: true } }
    }
  });

  const buildTree = (mId: number | null): any[] => {
    return allEmployees
      .filter(e => e.managerId === mId)
      .map(e => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        role: e.role.name,
        children: buildTree(e.id)
      }));
  };

  const hierarchy = buildTree(null);
  console.log("Hierarchy Structure:");
  console.log(JSON.stringify(hierarchy, null, 2));

  // 3. Test Recursive Reportee Utility (Internal logic test)
  const keyRoles = ['HOD', 'BM', 'BDM'];
  
  for (const roleName of keyRoles) {
    const managers = allEmployees.filter(e => e.role.name === roleName);
    for (const mgr of managers) {
        // Simulating the recursive CTE logic
        const getRecursive = (mId: number): number[] => {
            const subs = allEmployees.filter(e => e.managerId === mId);
            let ids = subs.map(s => s.id);
            for (const sub of subs) {
                ids = [...ids, ...getRecursive(sub.id)];
            }
            return ids;
        }

        const reportees = getRecursive(mgr.id);
        console.log(`\nRole: ${roleName} | Manager: ${mgr.firstName} ${mgr.lastName} (ID: ${mgr.id})`);
        console.log(`Recursive Reportees Count: ${reportees.length}`);
        console.log(`Reportee Names: ${reportees.map(id => allEmployees.find(e => e.id === id)?.firstName).join(', ')}`);
    }
  }

  await prisma.$disconnect();
}

checkHierarchy().catch(console.error);
