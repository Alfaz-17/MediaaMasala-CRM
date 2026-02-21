import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getRecursiveReporteeIds } from '../utils/userUtils';

export const getLeaves = async (req: Request, res: Response) => {
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
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
};

export const applyLeave = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { startDate, endDate, type, reason } = req.body;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    if (start < today) {
      return res.status(400).json({ message: 'Leave start date cannot be in the past' });
    }

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
    const existingLeave = await (prisma as any).leaveRequest.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (existingLeave.employeeId === user.employeeId) {
      return res.status(403).json({ message: 'You cannot approve your own leave request' });
    }

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
