import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboard } from '../../context/DashboardContext'
import QueueSection from '../../components/QueueSection/QueueSection'
import { getMockStreamer } from '../../mocks/mockStreamer'
import { GoPlus, GoCheck, GoX } from 'react-icons/go'
import OrderModal from '../../components/OrderModel/OrderModal'

import type { IStreamer, IVideoOrder, IQueue } from '../../interfaces/interfaces'

import styles from './Streamer.module.scss'
import formStyles from './AddQueueForm.module.scss'

const MY_STREAMER_ID = 2

interface Props {
    isOwner?: boolean
}

const Streamer = ({ isOwner = false }: Props) => {
    const { id } = useParams<{ id: string }>()
    const { activeQueueIds, setAllQueues, clearQueues, setActiveStreamerId, mode } = useDashboard()
    const [streamer, setStreamer] = useState<IStreamer | null>(null)
    const [orders, setOrders] = useState<IVideoOrder[]>([])
    const [queues, setQueues] = useState<IQueue[]>([])
    const streamerId = isOwner ? MY_STREAMER_ID : Number(id)

    useEffect(() => {
        setStreamer(null)
        setOrders([])
        setQueues([])
        clearQueues()

        if (!isOwner) {
            setActiveStreamerId(streamerId)
        }

        // TODO: замінити на API
        const data = getMockStreamer(streamerId)
        
        if (!data) {
            return
        }

        const sortedQueues = [...data.queues].sort((a, b) => b.pricePerMinute - a.pricePerMinute)

        setStreamer(data)
        setOrders(data.orders)
        setQueues(sortedQueues)
        setAllQueues(sortedQueues)

        return () => {
            if(!isOwner) {
                setActiveStreamerId(null)
            }
        }
    }, [streamerId])

    const handleRemoveOrder = (orderId: number) => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
    }

    const handleExtend = (orderId: number, additionalMinutes: number) => {
        setOrders((prev) => prev.map((o) =>
            o.id === orderId
                ? { ...o, orderedMinutes: parseFloat((o.orderedMinutes + additionalMinutes).toFixed(2)) }
                : o
        ))
    }

    const handleAddQueue = (queue: IQueue) => {
        setQueues((prev) => {
            const updated = [...prev, queue].sort((a, b) => b.pricePerMinute - a.pricePerMinute)
            setAllQueues(updated)
            return updated
        })
    }

    const handleUpdateQueue = (updated: IQueue) => {
        setQueues((prev) => {
            const next = prev
                .map((q) => (q.id === updated.id ? updated : q))
                .sort((a, b) => b.pricePerMinute - a.pricePerMinute)
            setAllQueues(next)
            return next
        })
    }

    const handleDeleteQueue = (queueId: number) => {
        setQueues((prev) => {
            const next = prev.filter((q) => q.id !== queueId)
            setAllQueues(next)
            return next
        })
        setOrders((prev) => prev.filter((o) => o.queueId !== queueId))
    }

    const handleAddOrder = (order: Omit<import('../../interfaces/interfaces').IVideoOrder, 'id' | 'status'>) => {
        const newOrder = {
            ...order,
            id: Date.now(),
        }
        setOrders((prev) => [...prev, newOrder])
    }

    if (!streamer) {
        return (
            <div className={styles.loading}>
                <span>Loading...</span>
            </div>
        )
    }

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
                        
                        {isOwner ? (
                            <span className={styles.page_header_badge}>You</span>
                        ) : null}
                    </h1>
                    <span className={styles.page_header_meta}>
                        {queues.length} queues · {orders.length} videos ordered
                    </span>
                </div>
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
                            orders={ orders.filter((o) => o.queueId === queue.id) }
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