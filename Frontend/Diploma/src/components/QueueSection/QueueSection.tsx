import VideoCard from '../VideoCard/VideoCard'

import type { IQueue, IVideoOrder } from '../../interfaces/interfaces'

import styles from './QueueSection.module.scss'

interface Props {
    queue: IQueue
    orders: IVideoOrder[]
    onRemove?: (orderId: number) => void
}

const QueueSection = ({ queue, orders, onRemove }: Props) => {

    return (
        <section className={styles.section}>
            <div className={styles.section_header}>
                <div className={styles.section_header_left}>
                    <span className={styles.section_header_label}>{queue.label}</span>
                    <span className={styles.section_header_count}>
                        {orders.length} {orders.length === 1 ? 'video' : 'videos'}
                    </span>
                </div>
                <span className={styles.section_header_price}>
                    ${queue.pricePerMinute}
                    <span className={styles.section_header_price_unit}>/min</span>
                </span>
            </div>

            {orders.length > 0 ? (
                <div className={styles.section_list}>
                    {orders.map((order) => (
                        <VideoCard
                            key={order.id}
                            order={order}
                            queue={queue}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.section_empty}>
                    No videos in this queue yet
                </div>
            )}
        </section>
    )
}

export default QueueSection