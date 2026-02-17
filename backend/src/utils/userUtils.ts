import prisma from '../lib/prisma';

/**
 * Recursively fetches all employee IDs in the reporting line below a given manager.
 * @param managerId The ID of the manager to start from.
 * @returns A promise that resolves to an array of employee IDs.
 */
export async function getRecursiveReporteeIds(managerId: number): Promise<number[]> {
  const directReportees = await prisma.employee.findMany({
    where: { managerId },
    select: { id: true }
  });

  const directReporteeIds = directReportees.map(r => r.id);
  
  if (directReporteeIds.length === 0) {
    return [];
  }

  // Recursive call for each direct reportee
  const nestedReportees = await Promise.all(
    directReporteeIds.map(id => getRecursiveReporteeIds(id))
  );

  // Flatten and return
  return [...directReporteeIds, ...nestedReportees.flat()];
}
