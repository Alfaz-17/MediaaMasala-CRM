import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const productInclude = {
  productManager: {
    select: { id: true, firstName: true, lastName: true, empId: true, role: { select: { name: true } }, department: { select: { name: true } } }
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await (prisma as any).product.findMany({
      where: { status: { not: 'Discontinued' } },
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
  try {
    const product = await (prisma as any).product.findUnique({
      where: { id: parseInt(id) },
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
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, productManagerId, status } = req.body;
  try {
    const product = await (prisma as any).product.create({
      data: {
        name,
        description,
        price,
        category,
        status: status || 'Active',
        productManagerId: productManagerId ? parseInt(productManagerId) : null
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
  try {
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
  try {
    await (prisma as any).product.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
