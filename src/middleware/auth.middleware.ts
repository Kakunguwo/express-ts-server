import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/utils/jwt";
import { UserJwtPayLoad } from "../interfaces/userJwtPayload";
import User from "../models/user.model";
import "dotenv/config";

// Extend Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({
                message: "Unauthorized - No token provided",
                success: false
            });
            return;
        }

        // Verify JWT secret exists
        const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
        if (!jwtSecret) {
            console.error("JWT_ACCESS_TOKEN_SECRET is not defined in environment variables");
            res.status(500).json({
                message: "Internal server error",
                success: false
            });
            return;
        }

        // Verify and decode token
        const decodedToken = verifyToken(token, jwtSecret) as UserJwtPayLoad;

        // Find user in database
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");

        if (!user) {
            res.status(401).json({
                message: "Unauthorized - Invalid token",
                success: false
            });
            return;
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error);

        // Handle specific JWT errors
        if (error instanceof Error) {
            if (error.message.includes("jwt expired")) {
                res.status(401).json({
                    message: "Token expired",
                    success: false
                });
                return;
            }

            if (error.message.includes("invalid token") || error.message.includes("Invalid token")) {
                res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
                return;
            }
        }

        // Generic server error
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}