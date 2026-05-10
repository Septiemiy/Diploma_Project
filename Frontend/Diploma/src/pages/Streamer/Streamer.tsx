import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboard } from '../../context/DashboardContext'
import QueueSection from '../../components/QueueSection/QueueSection'
import { getMockStreamer } from '../../mocks/mockStreamer'

import type { IStreamer, IVideoOrder } from '../../interfaces/interfaces'

import styles from './Streamer.module.scss'

const Streamer = () => {
    const { id } = useParams<{ id: string }>()
    const { activeQueueIds, setAllQueues, clearQueues, mode } = useDashboard()
    const [streamer, setStreamer] = useState<IStreamer | null>(null)
    const [orders, setOrders] = useState<IVideoOrder[]>([])

    useEffect(() => {
        setStreamer(null)
        setOrders([])
        clearQueues()

        // TODO: замінити на API
        const data = getMockStreamer(Number(id))
        
        if (!data) {
            return
        }

        const sortedQueues = [...data.queues].sort((a, b) => b.pricePerMinute - a.pricePerMinute)

        setStreamer(data)
        setOrders(data.orders)
        setAllQueues(sortedQueues)
    }, [id])

    const handleRemove = (orderId: number) => {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
    }

    if (!streamer) {
        return (
            <div className={styles.loading}>
                <span>Loading...</span>
            </div>
        )
    }

    const sortedQueues = [...streamer.queues].sort((a, b) => b.pricePerMinute - a.pricePerMinute)

    const visibleQueues = activeQueueIds.length > 0
            ? sortedQueues.filter((q) => activeQueueIds.includes(q.id))
            : sortedQueues

    return (
        <div className={styles.page}>
            <div className={styles.page_header}>
                <div className={styles.page_header_avatar}>
                    {streamer.username.slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.page_header_info}>
                    <h1 className={styles.page_header_name}>{streamer.username}</h1>
                    <span className={styles.page_header_meta}>
                        {streamer.queues.length} queues · {orders.length} videos ordered
                    </span>
                </div>
            </div>

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
                            onRemove={ handleRemove }
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Streamer;