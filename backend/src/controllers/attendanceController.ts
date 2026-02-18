import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getRecursiveReporteeIds } from '../utils/userUtils';

export const getAttendance = async (req: Request, res: Response) => {
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
        whereClause.employee = { ...whereClause.employee, departmentId: targetDeptId };
      } else if ((scope === 'department' || scope === 'team') && targetDeptId === user.departmentId) {
        whereClause.employee = { ...whereClause.employee, departmentId: targetDeptId };
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

    const attendance = await (prisma as any).attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          select: { firstName: true, lastName: true, department: { select: { name: true } } }
        }
      },
      orderBy: { date: 'desc' },
      take: 100
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};

export const checkIn = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { location, notes } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Check if already checked in today
    const existing = await (prisma as any).attendance.findFirst({
      where: {
        employeeId: user.employeeId,
        date: { gte: today }
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const record = await (prisma as any).attendance.create({
      data: {
        employeeId: user.employeeId,
        location,
        notes,
        status: 'Present' // Simple logic for now
      }
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error during check-in' });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const record = await (prisma as any).attendance.findFirst({
      where: {
        employeeId: user.employeeId,
        date: { gte: today },
        checkOut: null
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'No active check-in found for today' });
    }

    const updated = await (prisma as any).attendance.update({
      where: { id: record.id },
      data: { checkOut: new Date() }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error during check-out' });
  }
};
