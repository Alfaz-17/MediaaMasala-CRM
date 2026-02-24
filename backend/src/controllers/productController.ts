import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { getRecursiveReporteeIds } from '../utils/userUtils';
import { getModuleWhereClause } from '../utils/permissionUtils';

const productInclude = {
  productManager: {
    select: { id: true, firstName: true, lastName: true, empId: true, role: { select: { name: true } }, department: { select: { name: true } } }
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    // 1. Apply RBAC Scope using Centralized Utility
    let whereClause = await getModuleWhereClause(user, 'products');
    if (whereClause === null) return res.status(403).json({ message: 'Access denied' });
    
    // Maintain Discontinued filter
    whereClause.status = { not: 'Discontinued' };

    const products = await (prisma as any).product.findMany({
      where: whereClause,
      include: productInclude,
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const whereClause = await getModuleWhereClause(user, 'products');
    if (whereClause === null) return res.status(403).json({ message: 'Access denied' });

    const product = await (prisma as any).product.findFirst({
      where: {
        AND: [
          { id: parseInt(id) },
          whereClause
        ]
      },
      include: {
        ...productInclude,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            assignee: { select: { firstName: true, lastName: true } }
          },
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!product) return res.status(404).json({ message: 'Product not found or access denied' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, productManagerId, status } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  if (scope !== 'all') {
    return res.status(403).json({ message: 'Access denied: Only users with ALL scope can add new products to the catalog' });
  }

  try {
    const pmId = productManagerId ? parseInt(productManagerId) : null;

    // SCOPE CHECK for PM assignment
    if (pmId) {
       if (scope === 'own' && pmId !== user.employeeId) {
         return res.status(403).json({ message: 'Access denied: Can only manage your own products' });
       }
       if (scope === 'team') {
          const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
          if (pmId !== user.employeeId && !reporteeIds.includes(pmId)) {
            return res.status(403).json({ message: 'Access denied: PM not in your team' });
          }
       }
       if (scope === 'department') {
          const mgr = await prisma.employee.findUnique({ where: { id: pmId } });
          if (mgr && mgr.departmentId !== user.departmentId) {
            return res.status(403).json({ message: 'Access denied: PM from another department' });
          }
       }
    }

    const product = await (prisma as any).product.create({
      data: {
        name,
        description,
        price,
        category,
        status: status || 'Active',
        productManagerId: pmId
      },
      include: productInclude
    });
    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, category, isActive, productManagerId, status } = req.body;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const existing = await (prisma as any).product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    // SCOPE CHECK
    if (scope === 'own' && existing.productManagerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      if (existing.productManagerId !== user.employeeId && !reporteeIds.includes(existing.productManagerId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    if (scope === 'department' && existing.productManagerId) {
      const mgr = await prisma.employee.findUnique({ where: { id: existing.productManagerId } });
      if (mgr && mgr.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (category !== undefined) data.category = category;
    if (isActive !== undefined) data.isActive = isActive;
    if (status !== undefined) data.status = status;
    if (productManagerId !== undefined) data.productManagerId = productManagerId ? parseInt(productManagerId) : null;

    const product = await (prisma as any).product.update({
      where: { id: parseInt(id) },
      data,
      include: productInclude
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const scope = (req as any).permissionScope;

  try {
    const existing = await (prisma as any).product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ message: 'Product not found' });

    // SCOPE CHECK
    if (scope === 'own' && existing.productManagerId !== user.employeeId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (scope === 'team') {
      const reporteeIds = await getRecursiveReporteeIds(user.employeeId);
      if (existing.productManagerId !== user.employeeId && !reporteeIds.includes(existing.productManagerId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    if (scope === 'department' && existing.productManagerId) {
      const mgr = await prisma.employee.findUnique({ where: { id: existing.productManagerId } });
      if (mgr && mgr.departmentId !== user.departmentId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    await (prisma as any).product.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
