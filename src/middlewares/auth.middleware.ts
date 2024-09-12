import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

// Define a custom Request interface with additional properties
interface CustomRequest extends Request {
    _id?: string; // User's MongoDB _id
    role?: string; // Optional role
}

const authenticationMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    // Extract token from cookies
    const token = req.cookies.token; // Adjust the name to match your cookie name

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        // Decode the JWT to get the payload (which contains _id and role)
        const payload: any = jwt.verify(token, process.env.SECRET_KEY as string);
        
        // Attach _id and role from the token payload to the request object
        req._id = payload.id; // This refers to MongoDB's _id
        req.role = payload.role;
        
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

interface AuthorizationMiddlewareOptions {
    role: string[];
}

const authorizationMiddleware = ({ role }: AuthorizationMiddlewareOptions) => (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    if (!role.includes(req.role || '')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export default {authenticationMiddleware, authorizationMiddleware};
