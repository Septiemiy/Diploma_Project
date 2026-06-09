import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboard } from '../../context/DashboardContext'
import { useSubscription } from '../../hooks/useSubscription'
import { useRealtime } from '../../hooks/useSocket'
import { useAuth } from '../../context/AuthContext'
import { streamersApi, ordersApi, queuesApi } from '../../api/api'
import QueueSection from '../../components/QueueSection/QueueSection'
import OrderModal from '../../components/OrderModel/OrderModal'
import { GoPlus, GoCheck, GoX } from 'react-icons/go'

import type { IStreamer, IVideoOrder, IQueue } from '../../interfaces/interfaces'

import styles from './Streamer.module.scss'
import formStyles from './AddQueueForm.module.scss'


interface Props {
    isOwner?: boolean
}
 
const normalizeQueue = (q: any): IQueue => ({
    id: q.id,
    label: q.label,
    price_per_minute: q.price_per_minute,
    pricePerMinute: q.price_per_minute,
})
 
const normalizeOrder = (o: any, queueId: number): IVideoOrder => ({
    id: o.id,
    youtube_url: o.youtube_url,
    title: o.title,
    thumbnail: o.thumbnail,
    ordered_minutes: o.ordered_minutes,
    total_minutes: o.total_minutes,
    queue_id: queueId,
    queueId: queueId,
    status: o.status,
    viewer: Array.isArray(o.viewer) ? o.viewer[0] : o.viewer,
    viewerUsername: Array.isArray(o.viewer) ? o.viewer[0]?.username : o.viewer?.username,
})
 
const Streamer = ({ isOwner = false }: Props) => {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const { activeQueueIds, setAllQueues, clearQueues, setActiveStreamerId, mode } = useDashboard()
    const { isSubscribed, toggle } = useSubscription(isOwner ? undefined : id!)
 
    const [streamer, setStreamer] = useState<IStreamer | null>(null)
    const [orders, setOrders] = useState<IVideoOrder[]>([])
    const [queues, setQueues] = useState<IQueue[]>([])
    const [loading, setLoading] = useState(true)
 
    const streamerId = isOwner ? user?.id : id
 
    useRealtime({
        streamerId: streamerId ?? null,
        onOrderCreated: (order) => {
            setOrders((prev) => [...prev, normalizeOrder(order, order.queue_id)])
        },
        onOrderExtended: ({ orderId, newMinutes }) => {
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId
                        ? { ...o, ordered_minutes: newMinutes, orderedMinutes: newMinutes }
                        : o
                )
            )
        },
        onOrderRemoved: ({ orderId }) => {
            setOrders((prev) => prev.filter((o) => o.id !== orderId))
        },
        onQueueCreated: (queue) => {
            setQueues((prev) => {
                const updated = [...prev, normalizeQueue(queue)].sort(
                    (a, b) => (b.price_per_minute) - (a.price_per_minute)
                )
                setAllQueues(updated)
                return updated
            })
        },
        onQueueUpdated: (queue) => {
            setQueues((prev) => {
                const updated = prev
                    .map((q) => (q.id === queue.id ? normalizeQueue(queue) : q))
                    .sort((a, b) => b.price_per_minute - a.price_per_minute)
                setAllQueues(updated)
                return updated
            })
        },
        onQueueDeleted: ({ queueId }) => {
            setQueues((prev) => {
                const updated = prev.filter((q) => q.id !== queueId)
                setAllQueues(updated)
                return updated
            })
            setOrders((prev) => prev.filter((o) => o.queue_id !== queueId))
        },
    })
 
    useEffect(() => {
        if (!streamerId) return
 
        setLoading(true)
        setStreamer(null)
        setOrders([])
        setQueues([])
        clearQueues()
 
        const fetchFn = isOwner ? streamersApi.getMe() : streamersApi.getById(streamerId)
 
        fetchFn
            .then((data: any) => {
                const normalized: IStreamer = {
                    id: data.id,
                    username: data.username,
                    queues: data.queues,
                }
                setStreamer(normalized)
 
                const normalizedQueues = data.queues
                    .map(normalizeQueue)
                    .sort((a: IQueue, b: IQueue) => b.price_per_minute - a.price_per_minute)
 
                setQueues(normalizedQueues)
                setAllQueues(normalizedQueues)
 
                const allOrders = data.queues.flatMap((q: any) =>
                    (q.video_orders ?? []).map((o: any) => normalizeOrder(o, q.id))
                )
                setOrders(allOrders)
 
                if (!isOwner) setActiveStreamerId(streamerId)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
 
        return () => {
            if (!isOwner) setActiveStreamerId(null)
        }
    }, [streamerId])
 
    const handleRemoveOrder = async (orderId: number) => {
        try {
            await ordersApi.delete(orderId)
            setOrders((prev) => prev.filter((o) => o.id !== orderId))
        } catch (err) { console.error(err) }
    }
 
    const handleExtend = async (orderId: number, additionalMinutes: number) => {
        try {
            const { newMinutes } = await ordersApi.extend(orderId, additionalMinutes)
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, ordered_minutes: newMinutes } : o
                )
            )
        } catch (err) { console.error(err) }
    }
 
    const handleAddOrder = async (order: Omit<IVideoOrder, 'id' | 'status'>) => {
        try {
            await ordersApi.create({
                youtubeUrl: order.youtube_url,
                title: order.title,
                thumbnail: order.thumbnail,
                queueId: order.queue_id,
                orderedMinutes: order.ordered_minutes,
                totalMinutes: order.total_minutes,
            })
        } catch (err) { console.error(err) }
    }
 
    const handleAddQueue = async (queue: { label: string; price_per_minute: number }) => {
        try {
            await queuesApi.create(queue.label, queue.price_per_minute)
        } catch (err) { console.error(err) }
    }
 
    const handleUpdateQueue = async (updated: IQueue) => {
        try {
            await queuesApi.update(
                updated.id,
                updated.label,
                updated.price_per_minute
            )
        } catch (err) { console.error(err) }
    }
 
    const handleDeleteQueue = async (queueId: number) => {
        try {
            await queuesApi.delete(queueId)
            setQueues((prev) => {
                const next = prev.filter((q) => q.id !== queueId)
                setAllQueues(next)
                return next
            })
            setOrders((prev) => prev.filter((o) => o.queue_id !== queueId))
        } catch (err) { console.error(err) }
    }
 
    if (loading) return <div className={styles.loading}><span>Loading...</span></div>
    if (!streamer) return <div className={styles.loading}><span>Streamer not found</span></div>
 
    const visibleQueues = activeQueueIds.length > 0
        ? queues.filter((q) => activeQueueIds.includes(q.id))
        : queues
 
    return (
        <div className={styles.page}>
            <div className={styles.page_header}>
                <div className={styles.page_header_avatar}>
                    {streamer.username.slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.page_header_info}>
                    <h1 className={styles.page_header_name}>
                        {streamer.username}
                        {isOwner && <span className={styles.page_header_badge}>You</span>}
                    </h1>
                    <span className={styles.page_header_meta}>
                        {queues.length} queues · {orders.length} videos ordered
                    </span>
                </div>
                {!isOwner ? (
                    <button className={styles.page_header_subscribe} onClick={ toggle }>
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                ) : null}
            </div>
 
            {isOwner && (
                <AddQueueForm
                    onAdd={handleAddQueue}
                    existingIds={queues.map((q) => q.id)}
                />
            )}
 
            {visibleQueues.length === 0 ? (
                <div className={styles.page_empty}>No queues match the selected filter.</div>
            ) : (
                <div className={styles.page_queues}>
                    {visibleQueues.map((queue) => (
                        <QueueSection
                            key={queue.id}
                            queue={queue}
                            orders={orders.filter((o) => o.queue_id === queue.id)}
                            isOwner={isOwner}
                            onRemoveOrder={handleRemoveOrder}
                            onExtend={!isOwner ? handleExtend : undefined}
                            onUpdateQueue={isOwner ? handleUpdateQueue : undefined}
                            onDeleteQueue={isOwner ? handleDeleteQueue : undefined}
                        />
                    ))}
                </div>
            )}
 
            {!isOwner && mode === 'viewer' && (
                <OrderModal queues={queues} onSubmit={handleAddOrder} />
            )}
        </div>
    )
}
 
interface AddQueueFormProps {
    onAdd: (queue: IQueue) => void
    existingIds: number[]
}
 
const AddQueueForm = ({ onAdd }: AddQueueFormProps) => {
    const [open, setOpen] = useState(false)
    const [label, setLabel] = useState('')
    const [price, setPrice] = useState('')
    const [error, setError] = useState('')
 
    const handleSubmit = () => {
        const p = parseFloat(price)

        if (!label.trim()) {
            return setError('Queue name is required')
        }

        if (isNaN(p) || p <= 0) {
            return setError('Enter a valid price')
        }

        onAdd({ id: Date.now(), label: label.trim(), price_per_minute: p })

        setLabel('')
        setPrice('')
        setError('')
        setOpen(false)
    }
 
    const handleCancel = () => {
        setOpen(false)
        setLabel('')
        setPrice('')
        setError('')
    }
 
    if (!open) {
        return (
            <button className={formStyles.trigger} onClick={() => setOpen(true)}>
                <GoPlus size={15} />
                Add Queue
            </button>
        )
    }
 
    return (
        <div className={formStyles.form}>
            <div className={formStyles.form_fields}>
                <input
                    className={formStyles.form_input}
                    placeholder="Queue name"
                    value={ label }
                    onChange={(e) => setLabel(e.target.value)}
                    autoFocus
                />
                <input
                    className={formStyles.form_input}
                    placeholder="$ / min"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={ price }
                    onChange={(e) => setPrice(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                />
                <button className={formStyles.form_confirm} onClick={handleSubmit}>
                    <GoCheck size={15} />
                </button>
                <button className={formStyles.form_cancel} onClick={handleCancel}>
                    <GoX size={15} />
                </button>
            </div>
            {error ? <span className={formStyles.form_error}>{error}</span> : null}
        </div>
    )
}

export default Streamer;