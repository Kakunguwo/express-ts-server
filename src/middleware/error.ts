import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}


export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error)
    }

    res.status(error.code || 500).json({
        message: error.message || "Any unknown error occurred",
        success: false
    })
}