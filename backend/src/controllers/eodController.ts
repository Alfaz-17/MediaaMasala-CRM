import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getRecursiveReporteeIds } from '../utils/userUtils';

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
    const { departmentId, employeeId } = req.query;
    let whereClause: any = {};

    if (scope === 'own') {
      whereClause.employeeId = user.employeeId;
    } else if (scope === 'department') {
      whereClause.employee = { departmentId: user.departmentId };
    } else if (scope === 'team') {
        const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
        whereClause.employeeId = { in: [user.employeeId, ...reporteeIds] };
    }

    // Apply additional filters if scope allows
    if (departmentId) {
      const targetDeptId = Number(departmentId);
      if (scope === 'all') {
        whereClause.employee = { departmentId: targetDeptId };
      } else if ((scope === 'department' || scope === 'team') && targetDeptId === user.departmentId) {
        whereClause.employee = { departmentId: targetDeptId };
      }
    }

    if (employeeId) {
      const targetEmpId = Number(employeeId);
      if (scope === 'all') {
        whereClause.employeeId = targetEmpId;
      } else if (scope === 'department') {
        const emp = await prisma.employee.findUnique({ where: { id: targetEmpId } });
        if (emp && emp.departmentId === user.departmentId) {
          whereClause.employeeId = targetEmpId;
        }
      } else if (scope === 'team') {
        const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
        const teamIds = [user.employeeId, ...reporteeIds];
        if (teamIds.includes(targetEmpId)) {
          whereClause.employeeId = targetEmpId;
        }
      }
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
