import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import { getRecursiveReporteeIds } from '../utils/userUtils';
import { getModuleWhereClause } from '../utils/permissionUtils';


export const getDashboardStats = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const leadsWhere = await getModuleWhereClause(user, 'leads');
    const tasksWhere = await getModuleWhereClause(user, 'tasks');

    const [leadsCount, tasksDueToday, overdueTasks, myLeads, myTasksDueToday] = await Promise.all([
      // 1. Leads Counts
      leadsWhere !== null 
        ? prisma.lead.count({ where: leadsWhere as any })
        : Promise.resolve(0),
      
      // 2. Tasks Due Today
      tasksWhere !== null
        ? prisma.task.count({
            where: {
              ...tasksWhere,
              dueDate: { gte: startOfToday, lte: endOfToday }
            } as any
          })
        : Promise.resolve(0),

      // 3. Overdue Tasks
      tasksWhere !== null
        ? prisma.task.count({
            where: {
              ...tasksWhere,
              dueDate: { lt: startOfToday },
              status: { not: 'Completed' }
            } as any
          })
        : Promise.resolve(0),

      // 4. Personal Leads
      leadsWhere !== null 
        ? prisma.lead.count({ where: { ownerId: user.employeeId } })
        : Promise.resolve(0),
        
      // 5. Personal Tasks Due Today
      tasksWhere !== null
        ? prisma.task.count({
            where: {
              assigneeId: user.employeeId,
              dueDate: { gte: startOfToday, lte: endOfToday }
            }
          })
        : Promise.resolve(0)
    ]);

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
    const leadsWhere = await getModuleWhereClause(user, 'leads');
    const tasksWhere = await getModuleWhereClause(user, 'tasks');

    const [recentLeads, recentTasks] = await Promise.all([
      leadsWhere !== null
        ? prisma.lead.findMany({
            where: leadsWhere as any,
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              createdAt: true,
              owner: { select: { firstName: true, email: true } }
            }
          })
        : Promise.resolve([]),
      tasksWhere !== null
        ? prisma.task.findMany({
            where: tasksWhere as any,
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              title: true,
              createdAt: true,
              assignee: { select: { firstName: true, email: true } }
            }
          })
        : Promise.resolve([])
    ]);

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
