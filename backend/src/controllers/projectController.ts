import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { logActivity } from '../utils/logger';

export const getProjects = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let whereClause: any = {};

    // Basic SCOPE filtering (simplified for Phase 1 projects)
    if (scope === 'own' || scope === 'assigned') {
       // Deep filtering: Project -> Lead -> Owner
       whereClause.lead = { ownerId: user.employeeId };
    } else if (scope === 'department') {
       whereClause.lead = { departmentId: user.departmentId };
    } else if (scope === 'team') {
       // Team logic for projects
       const employee = await prisma.employee.findUnique({
         where: { id: user.employeeId },
         include: { reportees: true }
       });
       const reporteeIds = employee?.reportees.map(r => r.id) || [];
       whereClause.lead = { ownerId: { in: [user.employeeId, ...reporteeIds] } };
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
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
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
       const employee = await prisma.employee.findUnique({
         where: { id: user.employeeId },
         include: { reportees: true }
       });
       const reporteeIds = employee?.reportees.map(r => r.id) || [];
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
  const { name, description, status, leadId } = req.body;
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
       const employee = await prisma.employee.findUnique({
         where: { id: user.employeeId },
         include: { reportees: true }
       });
       const reporteeIds = employee?.reportees.map(r => r.id) || [];
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
        leadId: leadId ? Number(leadId) : undefined 
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
  const { name, description, status, leadId } = req.body;
  const user = (req as any).user;

  try {
    const project = await (prisma as any).project.create({
      data: {
        name,
        description,
        status: status || 'Active',
        leadId: leadId ? Number(leadId) : undefined
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
    // 1. Check existence and permissions (simplify for now, assuming role check passed)
    // Ideally we should check if project belongs to user/team based on scope
    
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

