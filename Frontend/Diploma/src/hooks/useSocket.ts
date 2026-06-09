import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeProps {
    streamerId: string | null
    onOrderCreated?: (order: any) => void
    onOrderExtended?: (data: { orderId: number; newMinutes: number }) => void
    onOrderRemoved?: (data: { orderId: number }) => void
    onQueueCreated?: (queue: any) => void
    onQueueUpdated?: (queue: any) => void
    onQueueDeleted?: (data: { queueId: number }) => void
}

export const useRealtime = ({
    streamerId,
    onOrderCreated,
    onOrderExtended,
    onOrderRemoved,
    onQueueCreated,
    onQueueUpdated,
    onQueueDeleted,
}: UseRealtimeProps) => {
    const channelRef = useRef<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!streamerId) return

        console.log('useRealtime: subscribing to streamer-', streamerId)

        const channel = supabase
            .channel(`streamer-${streamerId}-${Date.now()}`)

            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'queues',
            }, (payload) => {
                console.log('queue INSERT:', payload.new)
                if (payload.new.streamer_id === streamerId) {
                    onQueueCreated?.(payload.new)
                }
            })

            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'queues',
            }, (payload) => {
                console.log('queue UPDATE:', payload.new)
                if (payload.new.streamer_id === streamerId) {
                    onQueueUpdated?.(payload.new)
                }
            })

            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'queues',
            }, (payload) => {
                console.log('queue DELETE:', payload.old)
                onQueueDeleted?.({ queueId: payload.old.id })
            })

            // Замовлення — без фільтру
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'video_orders',
            }, (payload) => {
                console.log('order INSERT:', payload.new)
                onOrderCreated?.(payload.new)
            })

            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'video_orders',
            }, (payload) => {
                console.log('order UPDATE:', payload.new)
                onOrderExtended?.({
                    orderId: payload.new.id,
                    newMinutes: payload.new.ordered_minutes,
                })
            })

            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'video_orders',
            }, (payload) => {
                console.log('order DELETE:', payload.old)
                onOrderRemoved?.({ orderId: payload.old.id })
            })

            .subscribe((status) => {
                console.log('Realtime status:', status)
            })

        channelRef.current = channel

        return () => {
            console.log('useRealtime: unsubscribing')
            supabase.removeChannel(channel)
        }
    }, [streamerId])
}