import { Router } from 'express'
import { subscribe, unsubscribe, getMySubscriptions, getMySubscribers } from '../controllers/subscription.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/my',          authMiddleware, getMySubscriptions)
router.get('/subscribers', authMiddleware, getMySubscribers)
router.post('/:streamerId',   authMiddleware, subscribe)
router.delete('/:streamerId', authMiddleware, unsubscribe)

export default router