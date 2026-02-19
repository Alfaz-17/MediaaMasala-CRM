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

export const getLeads = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const { departmentId, ownerId, recursive } = req.query;
    let whereClause: any = {};

    const isRecursive = recursive === 'true';

    if (scope === 'own') {
      whereClause.ownerId = user.employeeId;
    } else if (scope === 'department') {
      whereClause.departmentId = user.departmentId;
    } else if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      whereClause.ownerId = { in: [user.employeeId, ...reporteeIds] };
    }

    // Apply additional filters if scope allows
    if (departmentId) {
      const targetDeptId = Number(departmentId);
      if (scope === 'all') {
        whereClause.departmentId = targetDeptId;
      } else if (scope === 'department' && targetDeptId === user.departmentId) {
        whereClause.departmentId = targetDeptId;
      } else if (scope === 'team' && targetDeptId === user.departmentId) {
        whereClause.departmentId = targetDeptId;
      }
    }

    if (ownerId) {
      const targetOwnerId = Number(ownerId);
      
      if (scope === 'all') {
        if (isRecursive) {
          const reporteeIds = await getRecursiveReporteeIds(targetOwnerId);
          whereClause.ownerId = { in: [targetOwnerId, ...reporteeIds] };
        } else {
          whereClause.ownerId = targetOwnerId;
        }
      } else if (scope === 'department') {
        const ownerEmp = await prisma.employee.findUnique({ where: { id: targetOwnerId } });
        if (ownerEmp && ownerEmp.departmentId === user.departmentId) {
          if (isRecursive) {
            const reporteeIds = await getRecursiveReporteeIds(targetOwnerId);
            whereClause.ownerId = { in: [targetOwnerId, ...reporteeIds] };
          } else {
            whereClause.ownerId = targetOwnerId;
          }
        }
      } else if (scope === 'team') {
        const myReporteeIds = await getRecursiveReporteeIds(user.employeeId);
        const teamIds = [user.employeeId, ...myReporteeIds];
        
        if (teamIds.includes(targetOwnerId)) {
          if (isRecursive) {
            const itsReporteeIds = await getRecursiveReporteeIds(targetOwnerId);
            // Filter itsReporteeIds to ensure they are also within MY team scope (safety)
            const allowedReporteeIds = itsReporteeIds.filter(id => teamIds.includes(id));
            whereClause.ownerId = { in: [targetOwnerId, ...allowedReporteeIds] };
          } else {
            whereClause.ownerId = targetOwnerId;
          }
        }
      }
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        source: true,
        status: true,
        createdAt: true,
        owner: { select: employeeSelect },
        department: { select: { id: true, name: true } }
      }
    });

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Error fetching leads' });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        source: true,
        status: true,
        notes: true,
        lostReason: true,
        ownerId: true,
        departmentId: true,
        owner: { select: employeeSelect },
        department: { select: { id: true, name: true } },
        leadNotes: {
          select: {
            id: true,
            content: true,
            isPrivate: true,
            createdAt: true,
            author: { select: employeeSelect }
          },
          orderBy: { createdAt: 'desc' }
        },
        followUpLogs: {
          select: {
            id: true,
            scheduledDate: true,
            completedDate: true,
            outcome: true,
            nextAction: true,
            employee: { select: employeeSelect }
          },
          orderBy: { scheduledDate: 'asc' }
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
            priority: true
          },
          orderBy: { dueDate: 'asc' }
        },
        // project: {
        //   select: {
        //     id: true,
        //     name: true,
        //     status: true
        //   }
        // }
      }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // RBAC: Check scope
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied: This sale does not belong to you' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied: Sale belongs to another department' });
    }
    if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
        return res.status(403).json({ message: 'Access denied: Sale is not owned by you or your team' });
      }
    }

    // Fetch project separately if needed (to bypass relation lint)
    const project = await (prisma as any).project.findUnique({
      where: { leadId: lead.id }
    });

    res.json({ ...lead, project });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Error loading sale' });
  }
};

export const createLead = async (req: Request, res: Response) => {
  const { name, email, phone, company, source, departmentId, notes } = req.body;
  const user = (req as any).user;

  try {
    const scope = (req as any).permissionScope;

    // RBAC: Validate Department/Owner
    let finalDepartmentId = departmentId ? Number(departmentId) : user.departmentId;
    let finalOwnerId = user.employeeId;

    if (scope === 'department' || scope === 'own') {
      // Force user's department if they don't have 'all' scope
      finalDepartmentId = user.departmentId;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        source,
        notes,
        departmentId: finalDepartmentId,
        ownerId: finalOwnerId
      }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'leads',
      action: 'CREATE',
      entityId: lead.id,
      entityName: lead.name,
      description: `New lead created: ${lead.name}`
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Error creating lead' });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, lostReason, ...rest } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) return res.status(404).json({ message: 'Lead not found' });

    // SCOPE CHECK
    if (scope === 'own' && existingLead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied: You can only edit your own leads' });
    }
    if (scope === 'department' && existingLead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied: Lead belongs to another department' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (existingLead.ownerId !== user.employeeId && !reporteeIds.includes(existingLead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied: Lead not in your team scope' });
       }
    }

    const updateData: any = { ...rest };
    if (status) {
      updateData.status = status;
      if (status === 'Lost') {
        updateData.lostReason = lostReason || 'No reason provided';
      }
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData
    });

    if (status && status !== existingLead.status) {
      await logActivity({
        employeeId: user.employeeId,
        module: 'leads',
        action: 'STATUS_CHANGE',
        entityId: lead.id,
        entityName: lead.name,
        description: `Lead status changed from ${existingLead.status} to ${status}`,
        metadata: { oldStatus: existingLead.status, newStatus: status, lostReason: updateData.lostReason }
      });
    } else {
      await logActivity({
        employeeId: user.employeeId,
        module: 'leads',
        action: 'UPDATE',
        entityId: lead.id,
        entityName: lead.name,
        description: `Lead information updated for ${lead.name}`
      });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead' });
  }
};

export const addLeadNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, isPrivate } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    if (!user.employeeId) return res.status(403).json({ message: 'Employee profile required' });

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // SCOPE CHECK
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied' });
       }
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        authorId: user.employeeId,
        content,
        isPrivate: isPrivate || false
      },
      include: { 
        author: { select: employeeSelect }
      }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'leads',
      action: 'NOTE_ADDED',
      entityId: id,
      entityName: lead?.name,
      description: `New note added to lead: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error adding note' });
  }
};

export const addFollowUp = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { scheduledDate, outcome, nextAction } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    if (!user.employeeId) return res.status(403).json({ message: 'Employee profile required' });

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // SCOPE CHECK
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied' });
       }
    }

    const followUp = await prisma.followUpLog.create({
      data: {
        leadId: id,
        employeeId: user.employeeId,
        scheduledDate: new Date(scheduledDate),
        outcome,
        nextAction
      },
      include: { 
        employee: { select: employeeSelect }
      }
    });

    await logActivity({
      employeeId: user.employeeId,
      module: 'leads',
      action: 'FOLLOW_UP',
      entityId: id,
      entityName: lead?.name,
      description: `Follow-up logged: ${outcome || 'No outcome provided'}`
    });

    res.status(201).json(followUp);
  } catch (error) {
    res.status(500).json({ message: 'Error logging follow-up' });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      select: employeeSelect
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

export const assignLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assigneeId } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // SCOPE CHECK (For Assignment, usually wider scope? But let's restrict to view scope)
    // If I can't view it, I can't assign it.
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied' });
       }
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { ownerId: assigneeId },
      include: { 
        owner: { select: employeeSelect }
      }
    });

    await prisma.leadAssignmentLog.create({
      data: {
        leadId: id,
        assignedToId: assigneeId,
        performedById: user.employeeId || 1, 
        leadStatus: updatedLead.status
      }
    });
    await logActivity({
      employeeId: user.employeeId,
      module: 'leads',
      action: 'ASSIGN',
      entityId: id,
      entityName: updatedLead.name,
      description: `Lead reassigned to ${updatedLead.owner?.firstName} ${updatedLead.owner?.lastName}`
    });

    res.json(updatedLead);
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ message: 'Error assigning lead' });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // SCOPE CHECK
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied' });
       }
    }

    await prisma.lead.delete({
      where: { id }
    });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead' });
  }
};

export const convertToProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { projectName, description } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const lead = await prisma.lead.findUnique({ 
        where: { id }
    });
    if (!lead) return res.status(404).json({ message: 'Sale not found' });

     // SCOPE CHECK
    if (scope === 'own' && lead.ownerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'department' && lead.departmentId !== user.departmentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
       const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
       if (lead.ownerId !== user.employeeId && !reporteeIds.includes(lead.ownerId as number)) {
         return res.status(403).json({ message: 'Access denied' });
       }
    }

    if (lead.status !== 'Won') return res.status(400).json({ message: 'Only "Won" sales can be converted to projects' });
    
    const existingProject = await (prisma as any).project.findUnique({
        where: { leadId: id }
    });
    if (existingProject) return res.status(400).json({ message: 'This sale already has an associated project' });

    const project = await (prisma as any).project.create({
      data: {
        name: projectName || `${lead.company || lead.name} - Implementation`,
        description: description || `Project initiated from Lead conversion.`,
        leadId: id,
        status: 'Active'
      }
    });

    await logActivity({
      employeeId: (req as any).user.employeeId,
      module: 'leads',
      action: 'CONVERT_TO_PROJECT',
      entityId: id,
      entityName: lead.name,
      description: `Lead converted to project: ${project.name}`
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ message: 'Error converting lead to project' });
  }
};
