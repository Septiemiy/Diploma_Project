import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'
import { AuthRequest } from '../middleware/auth.js'
import { io } from '../index.js'

const queueSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  pricePerMinute: z.number().positive('Price must be positive'),
})

export const createQueue = async (req: AuthRequest, res: Response) => {
    const parsed = queueSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error?.issues[0]?.message ?? 'Invalid input' })
        return
    }

    const streamerId = req.user!.userId
    const queue = await prisma.queue.create({
        data: { ...parsed.data, streamerId },
    })

    io.to(`streamer-${streamerId}`).emit('queue:created', queue)
    res.status(201).json(queue)
}

export const updateQueue = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string)
    const userId = req.user!.userId

    const queue = await prisma.queue.findUnique({ where: { id } })
    if (!queue) { 
        res.status(404).json({ message: 'Queue not found' })
        return 
    }
    if (queue.streamerId !== userId) { 
        res.status(403).json({ message: 'Forbidden' })
        return 
    }

    const parsed = queueSchema.partial().safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error?.issues[0]?.message ?? 'Invalid input' })
        return
    }

    const updated = await prisma.queue.update({
        where: { id },
        data: parsed.data as any,
    })

    io.to(`streamer-${userId}`).emit('queue:updated', updated)
    res.json(updated)
}

export const deleteQueue = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string)
    const userId = req.user!.userId

    const queue = await prisma.queue.findUnique({ where: { id } })
    if (!queue) { 
        res.status(404).json({ message: 'Queue not found' })
        return 
    }
    if (queue.streamerId !== userId) { 
        res.status(403).json({ message: 'Forbidden' })
        return 
    }

    await prisma.queue.delete({ where: { id } })

    io.to(`streamer-${userId}`).emit('queue:deleted', { queueId: id })
    res.json({ message: 'Queue deleted' })
}