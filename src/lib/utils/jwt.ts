import jwt, { JwtPayload } from "jsonwebtoken";
import { UserJwtPayLoad } from "../../interfaces/userJwtPayload";

// Type for JWT expiration - can be a number (seconds) or specific string format
type ExpiryInput = string | number;

export const generateToken = (payload: UserJwtPayLoad, secret: string, expiry: ExpiryInput): string => {
    // Cast to any to bypass strict typing issue with jsonwebtoken
    return jwt.sign(payload, secret, { expiresIn: expiry } as any);
}

export const verifyToken = (token: string, secret: string): UserJwtPayLoad => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Ensure the decoded token has the expected structure
        if (typeof decoded === 'string' || !decoded.id || !decoded.email) {
            throw new Error("Invalid token structure");
        }

        return {
            id: decoded.id,
            email: decoded.email
        };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expired");
        }
        if (error instanceof jwt.NotBeforeError) {
            throw new Error("Token not active");
        }
        throw error;
    }
}