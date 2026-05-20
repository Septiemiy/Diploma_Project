import { Response } from 'express'
import { prisma } from '../db/prisma.js'
import { AuthRequest } from '../middleware/auth.js'

const streamerSelect = {
  id: true,
  username: true,
  queues: {
    orderBy: { pricePerMinute: 'desc' as const },
    include: {
      orders: {
        where: { status: { not: 'done' } },
        orderBy: { createdAt: 'asc' as const },
        include: {
          viewer: { select: { id: true, username: true } },
        },
      },
    },
  },
}

export const getStreamer = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) { 
        res.status(400).json({ message: 'Invalid id' }); 
        return 
    }

    const streamer = await prisma.user.findUnique({
        where: { id },
        select: streamerSelect,
    })

    if (!streamer) { 
        res.status(404).json({ message: 'Streamer not found' }) 
        return 
    }
    res.json(streamer)
}

export const getMe = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId

    const streamer = await prisma.user.findUnique({
        where: { id: userId },
        select: streamerSelect,
    })

    if (!streamer) { 
        res.status(404).json({ message: 'User not found' }) 
        return 
    }
    res.json(streamer)
}

export const searchUsers = async (req: AuthRequest, res: Response) => {
    const q = String(req.query.q ?? '').trim()
    if (!q) { res.json([]); return }

    const users = await prisma.user.findMany({
        where: { username: { contains: q, mode: 'insensitive' } },
        select: { id: true, username: true },
        take: 10,
    })

    res.json(users)
}