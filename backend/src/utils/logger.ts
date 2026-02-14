import prisma from '../lib/prisma';

export const logActivity = async ({
  employeeId,
  module,
  action,
  entityId,
  entityName,
  description,
  metadata
}: {
  employeeId: number;
  module: string;
  action: string;
  entityId?: string;
  entityName?: string;
  description: string;
  metadata?: any;
}) => {
  try {
    await (prisma as any).activityLog.create({
      data: {
        employeeId,
        module,
        action,
        entityId: entityId?.toString(),
        entityName,
        description,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};
