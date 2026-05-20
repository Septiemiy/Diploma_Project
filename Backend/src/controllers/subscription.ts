import { Response } from 'express'
import { prisma } from '../db/prisma.js'
import { AuthRequest } from '../middleware/auth.js'

export const subscribe = async (req: AuthRequest, res: Response) => {
    const viewerId = req.user!.userId
    const streamerId = parseInt(req.params.streamerId as string)

    if (viewerId === streamerId) {
        res.status(400).json({ message: 'Cannot subscribe to yourself' })
        return
    }

    const streamer = await prisma.user.findUnique({ where: { id: streamerId } })
    if (!streamer) { 
        res.status(404).json({ message: 'Streamer not found' }) 
        return 
    }

    const sub = await prisma.subscription.upsert({
        where: { viewerId_streamerId: { viewerId, streamerId } },
        update: {},
        create: { viewerId, streamerId },
    })

    res.status(201).json(sub)
}

export const unsubscribe = async (req: AuthRequest, res: Response) => {
    const viewerId = req.user!.userId
    const streamerId = parseInt(req.params.streamerId as string)

    await prisma.subscription.deleteMany({ where: { viewerId, streamerId } })
    res.json({ message: 'Unsubscribed' })
}

export const getMySubscriptions = async (req: AuthRequest, res: Response) => {
    const viewerId = req.user!.userId

    const subs = await prisma.subscription.findMany({
        where: { viewerId },
        include: { streamer: { select: { id: true, username: true } } },
    })

    res.json(subs.map((s) => s.streamer))
}

export const getMySubscribers = async (req: AuthRequest, res: Response) => {
    const streamerId = req.user!.userId

    const subs = await prisma.subscription.findMany({
        where: { streamerId },
        include: { viewer: { select: { id: true, username: true } } },
    })

    res.json(subs.map((s) => s.viewer))
}