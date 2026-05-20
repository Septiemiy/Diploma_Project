import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const SOCKET_URL = import.meta.env.API_URL
    ? import.meta.env.API_URL.replace('/api', '')
    : 'http://localhost:4000'

let socket: Socket | null = null

export const useSocket = () => {
    const { token } = useAuth()
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        if (!token) return

        if (!socket) {
            socket = io(SOCKET_URL, {
                auth: { token },
                autoConnect: true,
            })
        }

        socketRef.current = socket

        socket.on('connect', () => {
            console.log('Socket connected:', socket?.id)
        })

        socket.on('connect_error', (err) => {
            console.error('Socket error:', err.message)
        })

        return () => {
            
        }
    }, [token])

    const joinRoom = (streamerId: number) => {
        socket?.emit('join-room', { streamerId })
    }

    const leaveRoom = (streamerId: number) => {
        socket?.emit('leave-room', { streamerId })
    }

    const disconnect = () => {
        socket?.disconnect()
        socket = null
    }

    return { socket: socketRef.current, joinRoom, leaveRoom, disconnect }
}