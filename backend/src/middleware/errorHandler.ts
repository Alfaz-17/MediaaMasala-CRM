import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate field value entered';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = `Database Error: ${err.message}`;
    }
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Operational Errors (AppError)
  if (err.isOperational) {
    // Message and statusCode already set
  } else if (statusCode === 500) {
    // Log unexpected errors
    console.error('💥 UNEXPECTED ERROR:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};
