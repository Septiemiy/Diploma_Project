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

export const useRealtime = ({ streamerId, onOrderCreated, onOrderExtended, onOrderRemoved, onQueueCreated, onQueueUpdated, onQueueDeleted,
}: UseRealtimeProps) => {
    const channelRef = useRef<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!streamerId) return

        const channel = supabase
            .channel(`streamer-${streamerId}`)

            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'video_orders',
                filter: `queue_id=in.(select id from queues where streamer_id=eq.${streamerId})`,
            }, (payload) => {
                onOrderCreated?.(payload.new)
            })

            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'video_orders',
            }, (payload) => {
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
                onOrderRemoved?.({ orderId: payload.old.id })
            })

            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'queues',
                filter: `streamer_id=eq.${streamerId}`,
            }, (payload) => {
                onQueueCreated?.(payload.new)
            })

            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'queues',
                filter: `streamer_id=eq.${streamerId}`,
            }, (payload) => {
                onQueueUpdated?.(payload.new)
            })

            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'queues',
            }, (payload) => {
                onQueueDeleted?.({ queueId: payload.old.id })
            })

            .subscribe()

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [streamerId])
}