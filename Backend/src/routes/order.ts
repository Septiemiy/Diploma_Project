import { Router } from 'express'
import { createOrder, extendOrder, deleteOrder } from '../controllers/order.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/',           authMiddleware, createOrder)
router.patch('/:id/extend', authMiddleware, extendOrder)
router.delete('/:id',      authMiddleware, deleteOrder)

export default router