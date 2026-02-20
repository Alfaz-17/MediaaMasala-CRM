import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';
import { getRecursiveReporteeIds } from '../utils/userUtils';

export const getProjects = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const { departmentId, employeeId } = req.query;
    let whereClause: any = {};

    // Basic SCOPE filtering
    if (scope === 'own' || scope === 'assigned') {
       whereClause.lead = { ownerId: user.employeeId };
    } else if (scope === 'department') {
       whereClause.lead = { departmentId: user.departmentId };
    } else if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       whereClause.lead = { ownerId: { in: [user.employeeId, ...reporteeIds] } };
    }

    // Apply additional filters if scope allows
    if (departmentId) {
      const targetDeptId = Number(departmentId);
      if (scope === 'all') {
        whereClause.lead = { ...whereClause.lead, departmentId: targetDeptId };
      } else if ((scope === 'department' || scope === 'team') && targetDeptId === user.departmentId) {
        whereClause.lead = { ...whereClause.lead, departmentId: targetDeptId };
      }
    }

    if (employeeId) {
      const targetEmpId = Number(employeeId);
      if (scope === 'all') {
        whereClause.lead = { ...whereClause.lead, ownerId: targetEmpId };
      } else if (scope === 'department') {
        const emp = await prisma.employee.findUnique({ where: { id: targetEmpId } });
        if (emp && emp.departmentId === user.departmentId) {
          whereClause.lead = { ...whereClause.lead, ownerId: targetEmpId };
        }
      } else if (scope === 'team') {
        const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
        const teamIds = [user.employeeId, ...reporteeIds];
        if (teamIds.includes(targetEmpId)) {
          whereClause.lead = { ...whereClause.lead, ownerId: targetEmpId };
        }
      }
    }

    const projects = await (prisma as any).project.findMany({
      where: whereClause,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true
          }
        },
        projectManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: { select: { name: true } },
            department: { select: { name: true } }
          }
        },
        relationshipManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: { select: { name: true } },
            department: { select: { name: true } }
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let whereClause: any = { id: Number(id) };

    // SCOPE Filtering
    if (scope === 'own' || scope === 'assigned') {
       whereClause.lead = { ownerId: user.employeeId };
    } else if (scope === 'department') {
       whereClause.lead = { departmentId: user.departmentId };
    } else if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       whereClause.lead = { ownerId: { in: [user.employeeId, ...reporteeIds] } };
    }

    const project = await (prisma as any).project.findFirst({
      where: whereClause,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
            email: true
          }
        },
        projectManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: { select: { name: true } },
            department: { select: { name: true } }
          }
        },
        relationshipManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: { select: { name: true } },
            department: { select: { name: true } }
          }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true
          },
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project detail:', error);
    res.status(500).json({ message: 'Error fetching project details' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, status, leadId, projectManagerId, relationshipManagerId } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    // 1. Check access first
    let whereClause: any = { id: Number(id) };
    if (scope === 'own' || scope === 'assigned') {
       whereClause.lead = { ownerId: user.employeeId };
    } else if (scope === 'department') {
       whereClause.lead = { departmentId: user.departmentId };
    } else if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       whereClause.lead = { ownerId: { in: [user.employeeId, ...reporteeIds] } };
    }

    const existingProject = await (prisma as any).project.findFirst({ where: whereClause });
    if (!existingProject) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const project = await (prisma as any).project.update({
      where: { id: Number(id) },
      data: { 
        name, 
        description, 
        status,
        leadId: leadId ? String(leadId) : undefined,
        projectManagerId: projectManagerId !== undefined ? (projectManagerId ? Number(projectManagerId) : null) : undefined,
        relationshipManagerId: relationshipManagerId !== undefined ? (relationshipManagerId ? Number(relationshipManagerId) : null) : undefined
      }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'projects',
      action: 'UPDATE',
      entityId: id,
      entityName: project.name,
      description: `Project details updated`
    });

    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const { name, description, status, leadId, projectManagerId, relationshipManagerId } = req.body;
  const user = (req as any).user;

  try {
    const scope = (req as any).permissionScope;

    if (leadId) {
      // RBC: Verify lead access
      const lead = await prisma.lead.findUnique({ where: { id: String(leadId) } });
      if (!lead) return res.status(404).json({ message: 'Lead not found' });

      if (scope === 'own' && lead.ownerId !== user.employeeId) {
        return res.status(403).json({ message: 'Access denied: You can only create projects for your own leads' });
      }
      if (scope === 'department' && lead.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied: Lead belongs to another department' });
      }
      if (scope === 'team') {
        const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
        if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
          return res.status(403).json({ message: 'Access denied: Lead not in your team scope' });
        }
      }
    }

    const project = await (prisma as any).project.create({
      data: {
        name,
        description,
        status: status || 'Active',
        leadId: leadId ? String(leadId) : undefined,
        projectManagerId: projectManagerId ? Number(projectManagerId) : undefined,
        relationshipManagerId: relationshipManagerId ? Number(relationshipManagerId) : undefined
      }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'projects',
      action: 'CREATE',
      entityId: String(project.id),
      entityName: project.name,
      description: `Created new project: ${project.name}`
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope; // Should check if user has permission to delete this specific project

  try {
    // 1. Check access first
    let whereClause: any = { id: Number(id) };
    if (scope === 'own' || scope === 'assigned') {
       whereClause.lead = { ownerId: user.employeeId };
    } else if (scope === 'department') {
       whereClause.lead = { departmentId: user.departmentId };
    } else if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       whereClause.lead = { ownerId: { in: [user.employeeId, ...reporteeIds] } };
    }

    const existingProject = await (prisma as any).project.findFirst({ where: whereClause });
    if (!existingProject) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    await (prisma as any).project.delete({
      where: { id: Number(id) }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'projects',
      action: 'DELETE',
      entityId: id,
      entityName: 'Project',
      description: `Project deleted`
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

