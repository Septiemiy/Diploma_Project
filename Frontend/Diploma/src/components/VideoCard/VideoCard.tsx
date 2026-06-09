import { useState } from 'react'
import { GoLinkExternal, GoTrash, GoPlus } from 'react-icons/go'
import type { IVideoOrder, IQueue } from '../../interfaces/interfaces'
import ExtendForm from '../ExtendForm/ExtendForm'
import styles from './VideoCard.module.scss'

interface Props {
    order: IVideoOrder
    queue: IQueue
    isOwner?: boolean
    onRemove?: (orderId: number) => void
    onExtend?: (orderId: number, additionalMinutes: number) => Promise<void>
}

const formatMinutes = (min: number) => {
    const m = Math.floor(min)
    const s = Math.round((min - m) * 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

const VideoCard = ({ order, queue, isOwner = false, onRemove, onExtend }: Props) => {
    const [isExtending, setIsExtending] = useState(false)

    const price = queue.price_per_minute
    const ordered = order.ordered_minutes
    const total = order.total_minutes
    const url = order.youtube_url
    const viewerName = order.viewer?.username ?? order.viewerUsername ?? ''

    const totalCost = (ordered * price).toFixed(2)
    const progressPercent = Math.min((ordered / total) * 100, 100)
    const isFullyOrdered = ordered >= total

    return (
        <div className={styles.card}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.card_thumb}>
                    <img src={order.thumbnail} alt={order.title} className={styles.card_thumb_img} />
                    <GoLinkExternal size={14} className={styles.card_thumb_icon} />
                </a>

                <div className={styles.card_info}>
                    <div className={styles.card_info_top}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.card_info_title}>
                            {order.title}
                        </a>
                        <span className={styles.card_info_viewer}>by {viewerName}</span>
                    </div>

                    <div className={styles.card_progress}>
                        <div className={styles.card_progress_bar}>
                            <div className={styles.card_progress_fill} style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className={styles.card_progress_labels}>
                            <span className={styles.card_progress_ordered}>{formatMinutes(ordered)} ordered</span>
                            <span className={styles.card_progress_total}>/ {formatMinutes(total)} total</span>
                        </div>
                    </div>

                    <div className={styles.card_footer}>
                        <div className={styles.card_footer_cost}>
                            <span className={styles.card_footer_cost_value}>${totalCost}</span>
                            <span className={styles.card_footer_cost_rate}>${price}/min</span>
                        </div>
                        <div className={styles.card_footer_actions}>
                            {!isOwner && !isFullyOrdered && (
                                <button
                                    className={`${styles.card_footer_extend} ${isExtending ? styles.card_footer_extend__active : ''}`}
                                    onClick={() => setIsExtending((v) => !v)}
                                >
                                    <GoPlus size={14} />
                                    <span>Extend</span>
                                </button>
                            )}
                            {isOwner && onRemove && (
                                <button className={styles.card_footer_remove} onClick={() => onRemove(order.id)}>
                                    <GoTrash size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            {isExtending && (
                <ExtendForm
                    orderId={order.id}
                    queue={queue}
                    orderedMinutes={ordered}
                    totalMinutes={total}
                    onExtend={onExtend!}
                    onCancel={() => setIsExtending(false)}
                />
            )}
        </div>
    )
}

export default VideoCard