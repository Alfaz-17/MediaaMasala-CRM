import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const submitEod = async (req: Request, res: Response) => {
  const { content, leadsCount, tasksCount, date } = req.body;
  const user = (req as any).user;

  try {
    if (!user.employeeId) {
      return res.status(403).json({ message: 'Employee profile required' });
    }

    const eod = await prisma.eodReport.create({
      data: {
        content,
        leadsCount: leadsCount || 0,
        tasksCount: tasksCount || 0,
        date: date ? new Date(date) : new Date(),
        employeeId: user.employeeId
      }
    });

    res.status(201).json(eod);
  } catch (error) {
    console.error('Error submitting EOD:', error);
    res.status(500).json({ message: 'Error submitting EOD' });
  }
};

export const getEodReports = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let whereClause: any = {};

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

    const reports = await prisma.eodReport.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: { select: { name: true } }
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 50
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching EOD reports:', error);
    res.status(500).json({ message: 'Error fetching EOD reports' });
  }
};
