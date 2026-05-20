import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

interface AuthSocket extends Socket {
  userId?: number
  username?: string
}

export const initSocket = (io: Server) => {
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) { next(new Error('No token')); return }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number
        username: string
      }
      socket.userId = decoded.userId
      socket.username = decoded.username
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket: AuthSocket) => {
    console.log(`Connected: ${socket.username} (${socket.id})`)

    socket.on('join-room', ({ streamerId }: { streamerId: number }) => {
      socket.join(`streamer-${streamerId}`)
    })

    socket.on('leave-room', ({ streamerId }: { streamerId: number }) => {
      socket.leave(`streamer-${streamerId}`)
    })

    socket.on('disconnect', () => {
    })
  })
}