import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { getRecursiveReporteeIds, getEmployeeHierarchy } from '../utils/userUtils';

const employeeSelect = {
  id: true,
  empId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  departmentId: true,
  roleId: true,
  managerId: true,
  department: {
    select: { id: true, name: true, code: true }
  },
  role: {
    select: { id: true, name: true, code: true }
  },
  manager: {
    select: { id: true, firstName: true, lastName: true }
  },
  user: {
    select: { isActive: true }
  }
};

//--- EMPLOYEE & USER MANAGEMENT (ONBOARDING) ---
export const getEmployees = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let whereClause: any = {};

    if (scope === 'own') {
      whereClause.id = user.employeeId;
    } else if (scope === 'department') {
      whereClause.departmentId = user.departmentId;
    } else if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      whereClause.id = { in: [user.employeeId, ...reporteeIds] };
    }


    const employees = await prisma.employee.findMany({
      where: whereClause,
      select: employeeSelect
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

export const getHierarchy = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    let rootId: number | null = null;

    if (scope === 'own') {
      rootId = user.employeeId;
    } else if (scope === 'department' || scope === 'team') {
      rootId = user.employeeId;
    } else if (scope === 'all') {
      rootId = null; // Admin sees all
    }

    const hierarchy = await getEmployeeHierarchy(rootId);
    res.json(hierarchy);
  } catch (error) {
    console.error("Hierarchy fetch error:", error);
    res.status(500).json({ message: 'Error fetching employee hierarchy' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  const { 
    firstName, lastName, email, phone, 
    departmentId, roleId, managerId, password 
  } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    // SCOPE CHECK: Only 'all' can create in any dept.
    if (scope !== 'all') {
      return res.status(403).json({ message: 'Access denied: Only users with ALL scope can onboard new employees' });
    }
    
    // Validate that departmentId is provided
    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 0. Auto-generate EmpID
      const lastEmployee = await tx.employee.findFirst({
        orderBy: { id: 'desc' }
      });
      
      let nextEmpId = "EMP001";
      if (lastEmployee && lastEmployee.empId) {
        const lastNum = parseInt(lastEmployee.empId.replace("EMP", ""));
        nextEmpId = `EMP${String(lastNum + 1).padStart(3, '0')}`;
      }

      // 1. Check for existing user
      let user = await tx.user.findUnique({ where: { email } });

      if (user) {
        // Validation: Role must belong to Department (or be global)
        const role = await tx.role.findUnique({ where: { id: Number(roleId) } });
        if (role && role.departmentId && role.departmentId !== Number(departmentId)) {
          throw new Error('Selected role does not belong to the selected department');
        }

        user = await tx.user.update({
          where: { id: user.id },
          data: {
            roleId: Number(roleId),
            departmentId: Number(departmentId)
          }
        });
      } else {
        // Validation: Role must belong to Department (or be global)
        const role = await tx.role.findUnique({ where: { id: Number(roleId) } });
        if (role && role.departmentId && role.departmentId !== Number(departmentId)) {
          throw new Error('Selected role does not belong to the selected department');
        }

        // Validation: New user must have a password
        if (!password) {
          throw new Error('Password is required for new account induction');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await tx.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            roleId: Number(roleId),
            departmentId: Number(departmentId)
          }
        });
      }

      // 2. Create Employee Profile
      const employee = await tx.employee.create({
        data: {
          empId: nextEmpId,
          firstName,
          lastName,
          email,
          phone,
          departmentId: Number(departmentId),
          roleId: Number(roleId),
          managerId: managerId ? Number(managerId) : null,
          userId: user.id
        }
      });

      return { user, employee };
    });

    res.status(201).json(result.employee);
  } catch (error: any) {
    console.error('Onboarding error:', error);
    res.status(400).json({ 
        message: 'Error onboarding employee. Ensure Email is unique.',
        error: error.message 
    });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
        firstName, lastName, phone, 
        departmentId, roleId, managerId, isActive 
    } = req.body;

    try {
        const employeeId = Number(id);
        const user = (req as any).user;
        const scope = (req as any).permissionScope;

        // Check if user has permission for this specific employee based on scope
        if (scope === 'own' && employeeId !== user.employeeId) {
            return res.status(403).json({ message: 'Access denied: You can only edit your own profile' });
        } else if (scope === 'team') {
            const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
            const teamIds = [user.employeeId, ...reporteeIds];
            if (!teamIds.includes(employeeId)) {
                return res.status(403).json({ message: 'Access denied: Employee not in your team' });
            }
        } else if (scope === 'department') {
            const targetEmp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { departmentId: true } });
            if (!targetEmp || targetEmp.departmentId !== user.departmentId) {
                return res.status(403).json({ message: 'Access denied: Employee belongs to another department' });
            }
        }


        const existingEmp = await prisma.employee.findUnique({ where: { id: employeeId } });
        if (!existingEmp) return res.status(404).json({ message: 'Employee not found' });

        const employee = await prisma.$transaction(async (tx) => {
            const updateData: any = { firstName, lastName, phone };

            // SECURITY PATCH: Only allow Role/Dept/Manager/Active changes if scope is 'all'
            // OR if the values aren't actually changing (to allow the request to pass)
            if (scope === 'all') {
                if (departmentId !== undefined) updateData.departmentId = Number(departmentId);
                if (roleId !== undefined) updateData.roleId = Number(roleId);
                if (managerId !== undefined) {
                    const newMgrId = managerId ? Number(managerId) : null;
                    
                    // CIRCULAR CHECK: New manager cannot be the employee themselves
                    if (newMgrId === employeeId) {
                        throw new Error('An employee cannot be their own manager');
                    }

                    // CIRCULAR CHECK: New manager cannot be a subordinate of this employee
                    if (newMgrId !== null) {
                        const reporteeIds = await getRecursiveReporteeIds(employeeId);
                        if (reporteeIds.includes(newMgrId)) {
                            throw new Error('Circular dependency: Selected manager is already a subordinate of this employee');
                        }
                    }
                    updateData.managerId = newMgrId;
                }
            } else {
                // If not 'all' scope, reject if they try to change sensitive fields
                if (
                    (departmentId !== undefined && Number(departmentId) !== existingEmp.departmentId) ||
                    (roleId !== undefined && Number(roleId) !== existingEmp.roleId) ||
                    (managerId !== undefined && (managerId ? Number(managerId) : null) !== existingEmp.managerId) ||
                    (isActive !== undefined)
                ) {
                    throw new Error('Access denied: You do not have permission to change role, department, manager, or status');
                }
            }

            // Validation: Role must belong to Department (or be global)
            if (updateData.roleId && updateData.departmentId) {
                const role = await tx.role.findUnique({ where: { id: updateData.roleId } });
                if (role && role.departmentId && role.departmentId !== updateData.departmentId) {
                    throw new Error('Selected role does not belong to the selected department');
                }
            }

            const emp = await tx.employee.update({
                where: { id: employeeId },
                data: updateData
            });

            if (emp.userId !== null) {
                const userUpdate: any = {};
                if (typeof isActive === 'boolean' && scope === 'all') userUpdate.isActive = isActive;
                if (updateData.roleId) userUpdate.roleId = updateData.roleId;
                if (updateData.departmentId) userUpdate.departmentId = updateData.departmentId;

                if (Object.keys(userUpdate).length > 0) {
                    await tx.user.update({
                        where: { id: emp.userId },
                        data: userUpdate
                    });
                }
            }
            return emp;
        });

        res.json(employee);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Error updating employee profile' });
    }
};

export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const unassignedRole = await prisma.role.findUnique({ where: { code: 'UNASSIGNED' } });
    if (!unassignedRole) return res.json([]);

    const users = await prisma.user.findMany({
      where: {
        roleId: unassignedRole.id,
        employee: null
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending users' });
  }
};

// --- DEPARTMENT CRUD ---

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true, leads: true }
        }
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, code, description } = req.body;
  const scope = (req as any).permissionScope;

  try {
    if (scope !== 'all') {
      return res.status(403).json({ message: 'Access denied: Requires system-wide scope' });
    }
    const department = await prisma.department.create({
      data: { name, code, description }
    });
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: 'Error creating department (ensure unique name/code)' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, code, description, isActive } = req.body;
  const scope = (req as any).permissionScope;

  try {
    if (scope !== 'all') {
      return res.status(403).json({ message: 'Access denied: Requires system-wide scope' });
    }
    const department = await prisma.department.update({
      where: { id: Number(id) },
      data: { name, code, description, isActive }
    });
    res.json(department);
  } catch (error) {
    res.status(400).json({ message: 'Error updating department' });
  }
};

// --- ROLE CRUD ---

export const getRoles = async (req: Request, res: Response) => {
  const { departmentId } = req.query;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const whereClause: any = {};
    
    if (scope === 'department') {
        whereClause.departmentId = user.departmentId;
    } else if (scope === 'team') {
        // Roles don't usually have a 'team' ownership, but we can restrict to their department or skip.
        // For strictness, if team scope, let's limit to Department for now or restrict strictly.
        whereClause.departmentId = user.departmentId;
    } else if (scope === 'own') {
        return res.status(403).json({ message: 'Access denied: You cannot view roles' });
    }

    if (departmentId && scope === 'all') {
      whereClause.departmentId = Number(departmentId);
    }

    const roles = await prisma.role.findMany({
      where: whereClause,
      include: {
        department: { select: { name: true, code: true } },
        _count: { select: { employees: true } }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name, code, description, departmentId } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const targetDeptId = departmentId ? Number(departmentId) : null;

    if (scope !== 'all') {
        return res.status(403).json({ message: 'Access denied: Only users with ALL scope can create new roles' });
    }

    const role = await prisma.role.create({
      data: {
        name,
        code,
        description,
        departmentId: targetDeptId,
        isActive: true
      }
    });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error creating role' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, code, description, isActive, departmentId } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const existingRole = await prisma.role.findUnique({ where: { id: Number(id) } });
    if (!existingRole) return res.status(404).json({ message: 'Role not found' });

    if (scope === 'department' && existingRole.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied: Cannot modify role outside your department' });
    }
    if (scope === 'team' || scope === 'own') {
        return res.status(403).json({ message: 'Access denied: Insufficient scope' });
    }

    // Prevent changing department if not admin
    const targetDeptId = scope === 'all' ? (departmentId ? Number(departmentId) : null) : existingRole.departmentId;

    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: { 
        name, 
        code, 
        description, 
        isActive,
        departmentId: targetDeptId
      }
    });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role' });
  }
};

// --- PERMISSION MATRIX ---
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions' });
  }
};

export const getRolePermissions = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: Number(roleId) },
      include: { permission: true }
    });
    res.json(rolePermissions.map(rp => rp.permission));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role permissions' });
  }
};

export const syncRolePermissions = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const targetRole = await prisma.role.findUnique({ where: { id: Number(roleId) } });
    if (!targetRole) return res.status(404).json({ message: 'Role not found' });

    if (scope === 'department' && targetRole.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied: Cannot sync permissions for role outside your department' });
    }
    if (scope === 'team' || scope === 'own') {
        return res.status(403).json({ message: 'Access denied: Insufficient scope' });
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: Number(roleId) } }),
      prisma.rolePermission.createMany({
        data: permissionIds.map((pId: number) => ({
          roleId: Number(roleId),
          permissionId: pId
        }))
      })
    ]);
    res.json({ message: 'Permissions synced successfully' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Error syncing permissions' });
  }
};

export const getPermissionMatrix = async (req: Request, res: Response) => {
  const { departmentId } = req.query;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const whereRole: any = {};
    
    if (scope === 'department' || scope === 'team') {
        whereRole.departmentId = user.departmentId;
    } else if (scope === 'own') {
        return res.status(403).json({ message: 'Access denied: Insufficient scope to view matrix' });
    }

    if (departmentId && departmentId !== 'all' && scope === 'all') {
      whereRole.OR = [
        { departmentId: Number(departmentId) },
        { departmentId: null }
      ];
    }

    const [roles, permissions, rolePermissions] = await Promise.all([
      prisma.role.findMany({
        where: whereRole,
        select: { id: true, name: true, code: true, departmentId: true }
      }),
      prisma.permission.findMany(),
      prisma.rolePermission.findMany()
    ]);

    // Build the matrix: { roleId: permIds[] }
    const matrix: Record<number, number[]> = {};
    
    // Initialize for all roles found
    roles.forEach(r => { matrix[r.id] = []; });
    
    // Populate with actual permissions
    rolePermissions.forEach(rp => {
      if (matrix[rp.roleId]) {
        matrix[rp.roleId].push(rp.permissionId);
      }
    });

    res.json({
      roles,
      permissions,
      matrix
    });
  } catch (error) {
    console.error('Matrix fetch error:', error);
    res.status(500).json({ message: 'Error fetching permission matrix' });
  }
};
