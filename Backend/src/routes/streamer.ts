import { Router } from 'express'
import { getStreamer, getMe, searchUsers } from '../controllers/streamer.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/me',     authMiddleware, getMe)
router.get('/search', authMiddleware, searchUsers)
router.get('/:id',    getStreamer)

export default router