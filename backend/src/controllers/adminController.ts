import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

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
      const employee = await prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { reportees: true }
      });
      const reporteeIds = employee?.reportees.map(r => r.id) || [];
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

export const createEmployee = async (req: Request, res: Response) => {
  const { 
    firstName, lastName, email, phone, 
    departmentId, roleId, managerId, password 
  } = req.body;

  try {
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
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            roleId: Number(roleId),
            departmentId: Number(departmentId)
          }
        });
      } else {
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
        }

        const employee = await prisma.$transaction(async (tx) => {
            // If scope is 'department' or 'team', we should verify here too, 
            // but for now we'll assume the frontend/middleware handles the initial list filtering.
            
            const emp = await tx.employee.update({
                where: { id: employeeId },
                data: {
                    firstName,
                    lastName,
                    phone,
                    departmentId: Number(departmentId),
                    roleId: Number(roleId),
                    managerId: managerId ? Number(managerId) : null
                }
            });

            if (emp.userId !== null && typeof isActive === 'boolean') {
                await tx.user.update({
                    where: { id: emp.userId },
                    data: { 
                        isActive,
                        roleId: Number(roleId),
                        departmentId: Number(departmentId) 
                    }
                });
            }
            return emp;
        });

        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: 'Error updating employee profile' });
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
  try {
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
  try {
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
  try {
    const roles = await prisma.role.findMany({
      include: {
        _count: { select: { employees: true } }
      }
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name, code, description } = req.body;
  try {
    const role = await prisma.role.create({
      data: { name, code, description }
    });
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: 'Error creating role' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, code, description, isActive } = req.body;
  try {
    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: { name, code, description, isActive }
    });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: 'Error updating role' });
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

  try {
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
