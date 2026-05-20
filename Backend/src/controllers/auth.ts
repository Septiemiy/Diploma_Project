import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'

const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
    email: z.string().email('Invalid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

const signToken = (userId: number, username: string) =>
    jwt.sign({ userId, username }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
} as jwt.SignOptions)

export const register = async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error?.issues[0]?.message ?? 'Invalid input' })
        return
    }

    const { username, email, password } = parsed.data

    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    })
    if (existing) {
        const field = existing.email === email ? 'Email' : 'Username'
        res.status(409).json({ message: `${field} is already taken` })
        return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { username, email, passwordHash },
    })

    const token = signToken(user.id, user.username)
    res.status(201).json({ token, user: { id: user.id, username: user.username } })
}

export const login = async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error?.issues[0]?.message ?? 'Invalid input' })
        return
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
    }

    const token = signToken(user.id, user.username)
    res.json({ token, user: { id: user.id, username: user.username } })
}