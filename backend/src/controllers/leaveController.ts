import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getLeaves = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let whereClause: any = {};

    if (scope === 'own') {
      whereClause.employeeId = user.employeeId;
    } else if (scope === 'department') {
      whereClause.employee = { departmentId: user.departmentId };
    } else if (scope === 'team') {
      const employee = await (prisma as any).employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map((r: any) => r.id) || [];
      whereClause.employeeId = { in: [user.employeeId, ...reporteeIds] };
    }

    const leaves = await (prisma as any).leaveRequest.findMany({
      where: whereClause,
      include: {
        employee: {
          select: { firstName: true, lastName: true, department: { select: { name: true } } }
        },
        approvedBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
};

export const applyLeave = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { startDate, endDate, type, reason } = req.body;

  try {
    const leave = await (prisma as any).leaveRequest.create({
      data: {
        employeeId: user.employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
        status: 'Pending'
      }
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Error applying for leave' });
  }
};

export const approveLeave = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status, managerNote } = req.body;

  try {
    const leave = await (prisma as any).leaveRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        managerNote,
        approvedById: user.employeeId,
        updatedAt: new Date()
      }
    });

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Error processing leave request' });
  }
};
