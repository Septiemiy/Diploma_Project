import { Router } from 'express'
import { createQueue, updateQueue, deleteQueue } from '../controllers/queue.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/',    authMiddleware, createQueue)
router.patch('/:id', authMiddleware, updateQueue)
router.delete('/:id', authMiddleware, deleteQueue)

export default router