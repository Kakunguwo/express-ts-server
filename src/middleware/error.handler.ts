import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { statusCode = 500, message } = error;

    // Log error for debugging (in production, use proper logging service)
    console.error('Error:', {
        message,
        statusCode,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
