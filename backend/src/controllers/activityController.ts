import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getActivityLogs = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;
  const { module, entityId, page = 1, limit = 50 } = req.query;

  try {
    let whereClause: any = {};

    // Filter by Entity or Module if provided
    if (module) whereClause.module = module;
    if (entityId) whereClause.entityId = entityId.toString();

    // RBAC Scope Filtering
    if (scope === 'own') {
      whereClause.employeeId = user.employeeId;
    } else if (scope === 'department') {
      whereClause.employee = { departmentId: user.departmentId };
    } else if (scope === 'team') {
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
      whereClause.employeeId = { in: [user.employeeId, ...reporteeIds] };
    }

    const logs = await (prisma as any).activityLog.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await (prisma as any).activityLog.count({ where: whereClause });

    res.json({
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
