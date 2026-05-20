import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: { userId: number; username: string }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' })
        return
    }

    const token = header.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number
            username: string
        }
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}