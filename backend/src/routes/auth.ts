import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        },
        department: true
      }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const employee = await prisma.employee.findUnique({ where: { userId: user.id } });

    // Flatten permissions for the token/response
    let permissions = user.role.permissions.map(rp => ({
      module: rp.permission.module,
      action: rp.permission.action,
      scope: rp.permission.scopeType
    }));

    // For ADMIN, we might want to ensure they always get specific "admin-only" feel if needed
    // but the middleware already handles the bypass.

    const token = jwt.sign(
      {
        id: user.id,
        employeeId: employee?.id,
        email: user.email,
        role: user.role.code,
        departmentId: user.departmentId,
        permissions: permissions
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        employeeId: employee?.id,
        employee: employee,
        email: user.email,
        name: user.email.split('@')[0], // Simplified name for now
        role: user.role.code,
        department: user.department.name
      },
      permissions
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Get UNASSIGNED Role and Dept
    const [unassignedRole, unassignedDept] = await Promise.all([
      prisma.role.findUnique({ where: { code: 'UNASSIGNED' } }),
      prisma.department.findUnique({ where: { code: 'UNASSIGNED' } })
    ]);

    if (!unassignedRole || !unassignedDept) {
      return res.status(500).json({ message: 'Infrastructure error: Default roles missing' });
    }

    // 4. Create User
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        roleId: unassignedRole.id,
        departmentId: unassignedDept.id,
        isActive: true // User account exists but has no permissions
      }
    });

    res.status(201).json({ 
      message: 'Registration successful. Please contact an admin for role assignment.',
      userId: user.id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const JWT_SECRET_LOCAL = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET_LOCAL) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        },
        department: true
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const employee = await prisma.employee.findUnique({ where: { userId: user.id } });

    const permissions = user.role.permissions.map(rp => ({
      module: rp.permission.module,
      action: rp.permission.action,
      scope: rp.permission.scopeType
    }));

    res.json({
      user: {
        id: user.id,
        employeeId: employee?.id,
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role.code,
        department: user.department.name
      },
      permissions
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  // Client handles token removal, backend can log or invalidate if using redis
  res.json({ message: 'Logged out successfully' });
});

export default router;
