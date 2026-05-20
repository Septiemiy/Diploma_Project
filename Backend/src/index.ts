import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { initSocket } from './socket/socket.js'

import authRoutes from './routes/auth.js'
import streamerRoutes from './routes/streamer.js'
import queueRoutes from './routes/queue.js'
import orderRoutes from './routes/order.js'
import subscriptionRoutes from './routes/subscription.js'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

initSocket(io)

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',          authRoutes)
app.use('/api/streamers',     streamerRoutes)
app.use('/api/queues',        queueRoutes)
app.use('/api/orders',        orderRoutes)
app.use('/api/subscriptions', subscriptionRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export { io }