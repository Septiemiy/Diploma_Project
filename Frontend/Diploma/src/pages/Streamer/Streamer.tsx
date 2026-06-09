import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboard } from '../../context/DashboardContext'
import QueueSection from '../../components/QueueSection/QueueSection'
import { ordersApi, queuesApi, streamersApi } from '../../api/api'
import { GoPlus, GoCheck, GoX } from 'react-icons/go'
import OrderModal from '../../components/OrderModel/OrderModal'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../hooks/useSocket'

import type { IStreamer, IVideoOrder, IQueue } from '../../interfaces/interfaces'

import styles from './Streamer.module.scss'
import formStyles from './AddQueueForm.module.scss'
import { useSubscription } from '../../hooks/useSubscription'



interface Props {
    isOwner?: boolean
}

const Streamer = ({ isOwner = false }: Props) => {
    const { id } = useParams<{ id: string }>()
    const { activeQueueIds, setAllQueues, clearQueues, setActiveStreamerId, mode } = useDashboard()
    const { isSubscribed, toggle } = useSubscription(isOwner ? undefined : Number(id))
    const [streamer, setStreamer] = useState<IStreamer | null>(null)
    const [orders, setOrders] = useState<IVideoOrder[]>([])
    const [queues, setQueues] = useState<IQueue[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const { joinRoom, leaveRoom, socket } = useSocket()
    const streamerId = isOwner ? user?.id : Number(id)

    useEffect(() => {
        if(!streamerId) {
            return
        }

        setLoading(true)
        setStreamer(null)
        setOrders([])
        setQueues([])
        clearQueues()

        const fetch = isOwner ? streamersApi.getMe() : streamersApi.getById(streamerId)
 
        fetch.then((data) => {
                const sorted = [...data.queues].sort(
                    (a: IQueue, b: IQueue) => b.pricePerMinute - a.pricePerMinute
                )
                setStreamer(data)
                setQueues(sorted)
                setAllQueues(sorted)
 
                const allOrders = data.queues.flatMap((queue: IQueue & { orders: IVideoOrder[] }) => 
                    queue.orders.map((order: IVideoOrder) => ({ ...order, queueId: queue.id }))
                )
                setOrders(allOrders)
 
                if (!isOwner) {
                    setActiveStreamerId(streamerId)
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false))
 
        return () => {
            if (!isOwner) {
                setActiveStreamerId(null)
            }
        }
    }, [streamerId])
 
    useEffect(() => {
        if (!streamerId) {
            return
        }

        joinRoom(streamerId)
        
        return () => leaveRoom(streamerId)
    }, [streamerId])
 
    useEffect(() => {
        if (!socket) {
            return
        }
 
        socket.on('order:created', (order: IVideoOrder) => {
            setOrders((prev) => [...prev, order])
        })
 
        socket.on('order:extended', ({ orderId, newMinutes }: { orderId: number; newMinutes: number }) => {
            setOrders((prev) => prev.map((order) =>
                    order.id === orderId ? { ...order, orderedMinutes: newMinutes } : order
                )
            )
        })
 
        socket.on('order:removed', ({ orderId }: { orderId: number }) => {
            setOrders((prev) => prev.filter((order) => order.id !== orderId))
        })
 
        socket.on('queue:created', (queue: IQueue) => {
            setQueues((prev) => {
                const updated = [...prev, queue].sort(
                    (a, b) => b.pricePerMinute - a.pricePerMinute
                )
                setAllQueues(updated)
                return updated
            })
        })
 
        socket.on('queue:updated', (queue: IQueue) => {
            setQueues((prev) => {
                const updated = prev
                    .map((updatedQueue) => (updatedQueue.id === queue.id ? queue : updatedQueue))
                    .sort((a, b) => b.pricePerMinute - a.pricePerMinute)
                setAllQueues(updated)
                return updated
            })
        })
 
        socket.on('queue:deleted', ({ queueId }: { queueId: number }) => {
            setQueues((prev) => {
                const updated = prev.filter((updatedQueue) => updatedQueue.id !== queueId)
                setAllQueues(updated)
                return updated
            })
            setOrders((prev) => prev.filter((order) => order.queueId !== queueId))
        })
 
        return () => {
            socket.off('order:created')
            socket.off('order:extended')
            socket.off('order:removed')
            socket.off('queue:created')
            socket.off('queue:updated')
            socket.off('queue:deleted')
        }
    }, [socket])

    const handleRemoveOrder = async (orderId: number) => {
        try {
            await ordersApi.delete(orderId)
            setOrders((prev) => prev.filter((order) => order.id !== orderId))
        } catch (err) {
            console.error(err)
        }
    }

    const handleExtend = async (orderId: number, additionalMinutes: number) => {
        try {
            const { newMinutes } = await ordersApi.extend(orderId, additionalMinutes)
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, orderedMinutes: newMinutes } : order
                )
            )
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddQueue = async (queue: IQueue) => {
        try {
            const newQueue = await queuesApi.create({
                label: queue.label,
                pricePerMinute: queue.pricePerMinute,
            })
            setQueues((prev) => {
                const updated = [...prev, newQueue].sort(
                    (a, b) => b.pricePerMinute - a.pricePerMinute
                )
                setAllQueues(updated)
                return updated
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdateQueue = async (updated: IQueue) => {
        try {
            const result = await queuesApi.update(updated.id, {
                label: updated.label,
                pricePerMinute: updated.pricePerMinute,
            })
            setQueues((prev) => {
                const next = prev
                    .map((queue) => (queue.id === result.id ? result : queue))
                    .sort((a, b) => b.pricePerMinute - a.pricePerMinute)
                setAllQueues(next)
                return next
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteQueue = async (queueId: number) => {
        try {
            await queuesApi.delete(queueId)
            setQueues((prev) => {
                const next = prev.filter((queue) => queue.id !== queueId)
                setAllQueues(next)
                return next
            })
            setOrders((prev) => prev.filter((order) => order.queueId !== queueId))
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddOrder = async (order: Omit<IVideoOrder, 'id' | 'status'>) => {
        try {
            const newOrder = await ordersApi.create(order)
            
        } catch (err) {
            console.error(err)
        }
    }

    if (!streamer) {
        return (
            <div className={styles.loading}>
                <span>Streamer not found</span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <span>Loading...</span>
            </div>
        )
    }

    const visibleQueues = activeQueueIds.length > 0
            ? queues.filter((queue) => activeQueueIds.includes(queue.id))
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
                        
                        {isOwner ? (
                            <span className={styles.page_header_badge}>You</span>
                        ) : null}
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

            {isOwner ? (
                <AddQueueForm onAdd={handleAddQueue} existingIds={queues.map((q) => q.id)} />
            ) : null}

            {visibleQueues.length === 0 ? (
                <div className={styles.page_empty}>
                    No queues match the selected filter.
                </div>
            ) : (
                <div className={styles.page_queues}>
                    {visibleQueues.map((queue) => (
                        <QueueSection
                            key={ queue.id }
                            queue={ queue }
                            orders={ orders.filter((order) => order.queueId === queue.id) }
                            onRemoveOrder={ handleRemoveOrder }
                            onExtend={ !isOwner ? handleExtend : undefined }
                            onUpdateQueue={ isOwner ? handleUpdateQueue : undefined }
                            onDeleteQueue={ isOwner ? handleDeleteQueue : undefined }
                            isOwner={ isOwner }
                        />
                    ))}
                </div>
            )}
            <div>
                {!isOwner && mode === 'viewer' ? (
                    <OrderModal queues={queues} onSubmit={handleAddOrder} />
                ) : null}
            </div>
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

        onAdd({ id: Date.now(), label: label.trim(), pricePerMinute: p })

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