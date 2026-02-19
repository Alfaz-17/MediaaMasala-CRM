import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    (req as any).user = user;
    next();
  });
};

import { AppError } from '../utils/AppError';

export const checkPermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return next(new AppError('Access denied: No user session', 403));
    }

    // ADMIN bypass
    if (user.role === 'ADMIN') {
      (req as any).permissionScope = 'all';
      return next();
    }

    try {
      // Fetch fresh permissions from database using the user's ID
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          role: {
            select: {
              code: true,
              permissions: {
                include: { permission: true }
              }
            }
          }
        }
      });

      if (!dbUser || !dbUser.role) {
        return next(new AppError('You do not have the necessary permissions to perform this action.', 403));
      }

      // Re-check if role was updated to ADMIN after login
      if (dbUser.role.code === 'ADMIN') {
        (req as any).permissionScope = 'all';
        return next();
      }

      const freshPermissions = dbUser.role.permissions.map(rp => ({
        module: rp.permission.module,
        action: rp.permission.action,
        scope: rp.permission.scopeType
      }));

      const permission = freshPermissions.find(
        (p: any) => p.module === module && p.action === action
      );

      if (!permission) {
        const actionMap: Record<string, string> = {
          'view': 'view this content',
          'create': 'create new items',
          'edit': 'make changes',
          'delete': 'delete items',
          'assign': 'assign items'
        };
        
        const readableAction = actionMap[action] || action;
        return next(new AppError(`You don't have permission to ${readableAction} in ${module}.`, 403));
      }

      // Attach permission scope to request for controller filtering
      (req as any).permissionScope = permission.scope;
      // Also attach all fresh permissions so controllers can use them
      (req as any).user.permissions = freshPermissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return next(new AppError('Error checking permissions', 500));
    }
  };
};

