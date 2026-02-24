import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getModuleWhereClause } from '../utils/permissionUtils';

export const getActivityLogs = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { module, entityId, page = 1, limit = 50 } = req.query;

  try {
    // 1. Apply RBAC Scope using Centralized Utility
    const rbacWhere = await getModuleWhereClause(user, 'activity');
    if (rbacWhere === null) return res.status(403).json({ message: 'Access denied' });

    let whereClause: any = { ...rbacWhere };

    // 2. Additional filters (narrow within scope, never widen)
    if (module) whereClause.module = module;
    if (entityId) whereClause.entityId = entityId.toString();

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
