import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

// Helper to determine the filter based on module name and permission scope
// Optimization: Cache team IDs per request if needed
const getModuleWhere = async (user: any, moduleName: string, cachedTeamIds?: number[]): Promise<any> => {
  if (user.role === 'ADMIN') return {};

  const permission = user.permissions?.find(
    (p: any) => p.module === moduleName && (p.action === 'view' || p.action === 'read')
  );

  if (!permission) return null; // Explicitly deny if no view permission

  const scope = permission.scope;

  if (scope === 'own') {
    return moduleName === 'leads' ? { ownerId: user.employeeId } : { assigneeId: user.employeeId };
  }

  if (scope === 'department') {
    if (moduleName === 'leads') return { departmentId: user.departmentId };
    return {
      OR: [
        { assignee: { departmentId: user.departmentId } },
        { creator: { departmentId: user.departmentId } }
      ]
    };
  }

  if (scope === 'team') {
    let teamIds = cachedTeamIds;
    if (!teamIds) {
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
      teamIds = [user.employeeId, ...reporteeIds];
    }

    if (moduleName === 'leads') return { ownerId: { in: teamIds } };
    return {
      OR: [
        { assigneeId: { in: teamIds } },
        { creatorId: { in: teamIds } }
      ]
    };
  }

  return {}; // 'all'
};

export const getDashboardStats = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    let teamIds: number[] | undefined;
    if (user.role !== 'ADMIN') {
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
      teamIds = [user.employeeId, ...reporteeIds];
    }

    const leadsWhere = await getModuleWhere(user, 'leads', teamIds);
    const tasksWhere = await getModuleWhere(user, 'tasks', teamIds);

    // 1. Leads Counts
    const leadsCount = leadsWhere !== null 
      ? await prisma.lead.count({ where: leadsWhere as any })
      : 0;
    
    // 2. Tasks Stats
    let tasksDueToday = 0;
    let overdueTasks = 0;

    if (tasksWhere !== null) {
      tasksDueToday = await prisma.task.count({
        where: {
          ...tasksWhere,
          dueDate: { gte: startOfToday, lte: endOfToday }
        } as any
      });

      overdueTasks = await prisma.task.count({
        where: {
          ...tasksWhere,
          dueDate: { lt: startOfToday },
          status: { not: 'Completed' }
        } as any
      });
    }

    // 3. Personal Stats (Always visible if module is visible)
    const myLeads = leadsWhere !== null 
      ? await prisma.lead.count({ where: { ownerId: user.employeeId } })
      : 0;
      
    const myTasksDueToday = tasksWhere !== null
      ? await prisma.task.count({
          where: {
            assigneeId: user.employeeId,
            dueDate: { gte: startOfToday, lte: endOfToday }
          }
        })
      : 0;

    res.json({
      global: {
        totalLeads: leadsCount,
        tasksDueToday,
        overdueTasks
      },
      personal: {
        myLeads,
        myTasksDueToday
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    let teamIds: number[] | undefined;
    if (user.role !== 'ADMIN') {
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
      teamIds = [user.employeeId, ...reporteeIds];
    }

    const leadsWhere = await getModuleWhere(user, 'leads', teamIds);
    const tasksWhere = await getModuleWhere(user, 'tasks', teamIds);

    let recentLeads: any[] = [];
    let recentTasks: any[] = [];

    if (leadsWhere !== null) {
      recentLeads = await prisma.lead.findMany({
        where: leadsWhere as any,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          owner: { select: { firstName: true, email: true } }
        }
      });
    }

    if (tasksWhere !== null) {
      recentTasks = await prisma.task.findMany({
        where: tasksWhere as any,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          assignee: { select: { firstName: true, email: true } }
        }
      });
    }

    const activities = [
      ...recentLeads.map(l => ({
        type: 'LEAD',
        message: `New lead created: ${l.name}`,
        user: l.owner?.firstName || l.owner?.email,
        timestamp: l.createdAt
      })),
      ...recentTasks.map(t => ({
        type: 'TASK',
        message: `New task assigned: ${t.title}`,
        user: t.assignee?.firstName || t.assignee?.email,
        timestamp: t.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
};
