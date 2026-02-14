import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';

const employeeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  department: {
    select: {
      id: true,
      name: true
    }
  }
};

const leadSelect = {
  id: true,
  name: true,
  company: true,
  status: true
};

const projectSelect = {
  id: true,
  name: true,
  status: true
};

const productSelect = {
  id: true,
  name: true,
  category: true
};

export const getTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;
  const { filter } = req.query;

  try {
    let whereClause: any = {};

    // 1. Apply RBAC Scope
    if (scope === 'own') {
      whereClause.assigneeId = user.employeeId;
    } else if (scope === 'department') {
      whereClause.OR = [
        { assignee: { departmentId: user.departmentId } },
        { creator: { departmentId: user.departmentId } }
      ];
    } else if (scope === 'team') {
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
      const teamIds = [user.employeeId, ...reporteeIds];
      whereClause.OR = [
        { assigneeId: { in: teamIds } },
        { creatorId: { in: teamIds } }
      ];
    }

    // 2. Apply explicit filters
    if (filter === 'my') {
      whereClause.assigneeId = user.employeeId;
    }

    const tasks = await (prisma as any).task.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        priority: true,
        status: true,
        completedAt: true,
        completionNote: true,
        relatedToLeadId: true,
        projectId: true,
        productId: true,
        assignee: { select: employeeSelect },
        creator: { select: employeeSelect },
        lead: { select: leadSelect },
        project: { select: projectSelect },
        product: { select: productSelect }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const task = await (prisma as any).task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        priority: true,
        status: true,
        completedAt: true,
        completionNote: true,
        assigneeId: true,
        creatorId: true,
        relatedToLeadId: true,
        projectId: true,
        productId: true,
        assignee: { select: employeeSelect },
        creator: { select: employeeSelect },
        lead: { select: leadSelect },
        project: { select: projectSelect },
        product: { select: productSelect }
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // RBAC Scope Check
    if (scope === 'own' && task.assigneeId !== user.employeeId && task.creatorId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, assigneeId, leadId, projectId, productId } = req.body;
  const user = (req as any).user;

  try {
    const task = await (prisma as any).task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        status: 'Pending',
        assigneeId: assigneeId || user.employeeId,
        creatorId: user.employeeId,
        relatedToLeadId: leadId ? String(leadId) : null,
        projectId: projectId ? Number(projectId) : null,
        productId: productId ? Number(productId) : null
      },
      include: {
        assignee: { select: { firstName: true, lastName: true } }
      }
    });

    if (leadId) {
       await logActivity({
        employeeId: user.employeeId,
        module: 'leads',
        action: 'TASK_CREATE',
        entityId: String(leadId),
        entityName: title,
        description: `Task created: ${title}`
      });
    }

    if (projectId) {
       await logActivity({
        employeeId: user.employeeId,
        module: 'projects',
        action: 'TASK_CREATE',
        entityId: String(projectId),
        entityName: title,
        description: `Task created: ${title}`
      });
    }

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, completionNote, dueDate, ...rest } = req.body;

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    const updateData: any = { ...rest };
    if (dueDate) updateData.dueDate = new Date(dueDate);

    if (status) {
      updateData.status = status;
      if (status === 'Completed') {
        updateData.completedAt = new Date();
        updateData.completionNote = completionNote || 'No completion note provided';
      } else if (existingTask.status === 'Completed' && status !== 'Completed') {
        updateData.completedAt = null;
        updateData.completionNote = null;
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
