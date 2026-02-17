import prisma from '../lib/prisma';

/**
 * Recursively fetches all employee IDs in the reporting line below a given manager.
 * @param managerId The ID of the manager to start from.
 * @returns A promise that resolves to an array of employee IDs.
 */
export async function getRecursiveReporteeIds(managerId: number): Promise<number[]> {
  // Fetch all employees once to build the hierarchy in memory
  // This is much faster than recursive DB queries for small to medium organizations
  const allEmployees = await prisma.employee.findMany({
    select: { id: true, managerId: true }
  });

  const reporteeIds: number[] = [];
  const queue = [managerId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const directReportees = allEmployees.filter(e => e.managerId === currentId);
    
    for (const reportee of directReportees) {
      if (!reporteeIds.includes(reportee.id)) {
        reporteeIds.push(reportee.id);
        queue.push(reportee.id);
      }
    }
  }

  return reporteeIds;
}
