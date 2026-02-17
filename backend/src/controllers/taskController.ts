import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';
import { getRecursiveReporteeIds } from '../utils/userUtils';

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
  const { filter, departmentId, assigneeId } = req.query;

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
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      const teamIds = [user.employeeId, ...reporteeIds];
      whereClause.OR = [
        { assigneeId: { in: teamIds } },
        { creatorId: { in: teamIds } }
      ];
    }

    // 2. Apply explicit filters (Team/Dept)
    if (departmentId) {
      const targetDeptId = Number(departmentId);
      // Valid if Admin (all) or if it's the user's own department
      if (scope === 'all' || (scope !== 'own' && targetDeptId === user.departmentId)) {
        whereClause.assignee = { departmentId: targetDeptId };
        // Remove OR if we are strictly filtering by department
        delete whereClause.OR;
      }
    }

    if (assigneeId) {
      const targetAssigneeId = Number(assigneeId);
      let isAllowed = false;

      if (scope === 'all') {
        isAllowed = true;
      } else if (scope === 'department') {
        const emp = await prisma.employee.findUnique({ where: { id: targetAssigneeId } });
        isAllowed = (emp?.departmentId === user.departmentId);
      } else if (scope === 'team') {
        const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
        const teamIds = [user.employeeId, ...reporteeIds];
        isAllowed = teamIds.includes(targetAssigneeId);
      } else if (scope === 'own') {
        isAllowed = (targetAssigneeId === user.employeeId);
      }

      if (isAllowed) {
        whereClause.assigneeId = targetAssigneeId;
        delete whereClause.OR; // Narrow down to specific assignee
      }
    }

    // 3. Legacy filter compatibility
    if (filter === 'my') {
      whereClause.assigneeId = user.employeeId;
      delete whereClause.OR;
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
      return res.status(403).json({ message: 'Access denied: Task does not belong to you' });
    }
    if (scope === 'department') {
      const assigneeDeptId = task.assignee?.departmentId;
      const creatorDeptId = task.creator?.departmentId;
      if (assigneeDeptId !== user.departmentId && creatorDeptId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied: Task belongs to another department' });
      }
    }
    if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      const teamIds = [user.employeeId, ...reporteeIds];
      if (!teamIds.includes(task.assigneeId) && !teamIds.includes(task.creatorId)) {
        return res.status(403).json({ message: 'Access denied: Task is not in your team scope' });
      }
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
    const scope = (req as any).permissionScope;

    // RBAC: Validate Assignee based on Scope
    const targetAssigneeId = assigneeId || user.employeeId;

    if (scope === 'own' && targetAssigneeId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied: You can only assign tasks to yourself' });
    }

    if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      const teamIds = [user.employeeId, ...reporteeIds];
      if (!teamIds.includes(Number(targetAssigneeId))) {
        return res.status(403).json({ message: 'Access denied: You can only assign tasks to members of your team' });
      }
    }

    if (scope === 'department') {
      const assigneeEmp = await prisma.employee.findUnique({ 
        where: { id: Number(targetAssigneeId) },
        select: { departmentId: true }
      });
      if (!assigneeEmp || assigneeEmp.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied: You can only assign tasks within your department' });
      }
    }

    const task = await (prisma as any).task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        status: 'Pending',
        assigneeId: Number(targetAssigneeId),
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
