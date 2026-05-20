import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../db/prisma.js'
import { AuthRequest } from '../middleware/auth.js'
import { io } from '../index.js'

const createOrderSchema = z.object({
  youtubeUrl:     z.string().url(),
  title:          z.string().min(1),
  thumbnail:      z.string().url(),
  queueId:        z.number().int().positive(),
  orderedMinutes: z.number().positive(),
  totalMinutes:   z.number().positive(),
})

export const createOrder = async (req: AuthRequest, res: Response) => {
    const parsed = createOrderSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error?.issues[0]?.message ?? 'Invalid input' })
        return
    }

    const viewerId = req.user!.userId
    const { queueId, orderedMinutes, totalMinutes } = parsed.data

    const queue = await prisma.queue.findUnique({ where: { id: queueId } })
    if (!queue) { 
        res.status(404).json({ message: 'Queue not found' }); 
        return 
    }
    if (queue.streamerId === viewerId) {
        res.status(403).json({ message: 'Cannot order on your own stream' })
        return
    }
    if (orderedMinutes > totalMinutes) {
        res.status(400).json({ message: 'Ordered minutes cannot exceed total minutes' })
        return
    }

    const order = await prisma.videoOrder.create({
        data: { ...parsed.data, viewerId },
        include: { viewer: { select: { id: true, username: true } } },
    })

    io.to(`streamer-${queue.streamerId}`).emit('order:created', order)
    res.status(201).json(order)
}

export const extendOrder = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string)
    const userId = req.user!.userId

    const { additionalMinutes } = req.body
    if (typeof additionalMinutes !== 'number' || additionalMinutes <= 0) {
        res.status(400).json({ message: 'Invalid additionalMinutes' })
        return
    }

    const order = await prisma.videoOrder.findUnique({
        where: { id },
        include: { queue: true },
    })
    if (!order) { 
        res.status(404).json({ message: 'Order not found' })
        return 
    }
    if (order.viewerId !== userId) { 
        res.status(403).json({ message: 'Forbidden' })
        return 
    }

    const newMinutes = parseFloat((order.orderedMinutes + additionalMinutes).toFixed(2))
    if (newMinutes > order.totalMinutes) {
        res.status(400).json({ message: 'Exceeds video duration' })
        return
    }

    const updated = await prisma.videoOrder.update({
        where: { id },
        data: { orderedMinutes: newMinutes },
    })

    io.to(`streamer-${order.queue.streamerId}`).emit('order:extended', {
        orderId: id,
        newMinutes,
    })
    res.json({ orderId: id, newMinutes })
}

export const deleteOrder = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string)
    const userId = req.user!.userId

    const order = await prisma.videoOrder.findUnique({
        where: { id },
        include: { queue: true },
    })
    if (!order) { 
        res.status(404).json({ message: 'Order not found' })
        return 
    }
    if (order.queue.streamerId !== userId) {
        res.status(403).json({ message: 'Forbidden' })
        return
    }

    await prisma.videoOrder.delete({ where: { id } })

    io.to(`streamer-${userId}`).emit('order:removed', { orderId: id })
    res.json({ message: 'Order removed' })
}