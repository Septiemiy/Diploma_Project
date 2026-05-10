import { GoLinkExternal, GoTrash, GoPlus } from 'react-icons/go'

import type { IVideoOrder, IQueue } from '../../interfaces/interfaces'

import styles from './VideoCard.module.scss'

interface Props {
    order: IVideoOrder
    queue: IQueue
    isOwner?: boolean
    onRemove?: (orderId: number) => void
}

const formatMinutes = (min: number) => {
    const m = Math.floor(min)
    const s = Math.round((min - m) * 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

const VideoCard = ({ order, queue, isOwner = false, onRemove }: Props) => {
    const totalCost = (order.orderedMinutes * queue.pricePerMinute).toFixed(2)
    const progressPercent = Math.min((order.orderedMinutes / order.totalMinutes) * 100, 100)
    const isFullyOrdered = order.orderedMinutes >= order.totalMinutes

    return (
        <div className={styles.card}>
            <a
                href={ order.youtubeUrl }
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card_thumb}
            >
                <img
                    src={ order.thumbnail }
                    alt={ order.title }
                    className={styles.card_thumb_img}
                />
                <GoLinkExternal size={14} className={styles.card_thumb_icon} />
            </a>

            <div className={styles.card_info}>
                <div className={styles.card_info_top}>
                    <a
                        href={ order.youtubeUrl }
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.card_info_title}
                    >
                        { order.title }
                    </a>
                    <span className={styles.card_info_viewer}>
                        by {order.viewerUsername}
                    </span>
                </div>

                <div className={styles.card_progress}>
                    <div className={styles.card_progress_bar}>
                        <div
                            className={styles.card_progress_fill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className={styles.card_progress_labels}>
                        <span className={styles.card_progress_ordered}>
                            {formatMinutes(order.orderedMinutes)} ordered
                        </span>
                        <span className={styles.card_progress_total}>
                            / {formatMinutes(order.totalMinutes)} total
                        </span>
                    </div>
                </div>

                <div className={styles.card_footer}>
                    <div className={styles.card_footer_cost}>
                        <span className={styles.card_footer_cost_value}>
                            ${totalCost}
                        </span>
                        <span className={styles.card_footer_cost_rate}>
                            ${queue.pricePerMinute}/min
                        </span>
                    </div>

                    <div className={styles.card_footer_actions}>
                        {!isOwner && !isFullyOrdered ? (
                            <button
                                className={styles.card_footer_extend}
                                title="Order more minutes"
                                onClick={() => {
                                    // TODO: відкрити форму дозамовлення
                                    console.log('Extend order:', order.id)
                                }}
                            >
                                <GoPlus size={14} />
                                <span>Extend</span>
                            </button>
                        ) : null}

                        {isOwner && onRemove ? (
                            <button
                                className={styles.card_footer_remove}
                                title="Remove from queue"
                                onClick={() => onRemove(order.id)}
                            >
                                <GoTrash size={14} />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard