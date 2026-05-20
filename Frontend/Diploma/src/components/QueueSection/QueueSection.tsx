import VideoCard from '../VideoCard/VideoCard'
import { useState } from 'react'
import { GoPencil, GoTrash, GoCheck, GoX } from 'react-icons/go'

import type { IQueue, IVideoOrder } from '../../interfaces/interfaces'

import styles from './QueueSection.module.scss'

interface Props {
    queue: IQueue
    orders: IVideoOrder[]
    isOwner?: boolean
    onRemoveOrder?: (orderId: number) => void
    onExtend?: (orderId: number, additionalMinutes: number) => Promise<void>
    onUpdateQueue?: (updated: IQueue) => void
    onDeleteQueue?: (queueId: number) => void
}

const QueueSection = ({ queue, orders, isOwner = false, onRemoveOrder, onExtend, onUpdateQueue, onDeleteQueue }: Props) => {
    const [editing, setEditing] = useState(false)
    const [label, setLabel] = useState(queue.label)
    const [price, setPrice] = useState(String(queue.pricePerMinute))

    const handleSave = () => {
        const p = parseFloat(price)

        if (!label.trim() || isNaN(p) || p <= 0) {
            return
        }

        onUpdateQueue?.({ ...queue, label: label.trim(), pricePerMinute: p })
        setEditing(false)
    }

    const handleCancel = () => {
        setLabel(queue.label)
        setPrice(String(queue.pricePerMinute))
        setEditing(false)
    }

    return (
        <section className={styles.section}>
            <div className={styles.section_header}>
                {editing ? (
                     <div className={styles.section_header_edit}>
                        <input
                            className={styles.section_header_input}
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            autoFocus
                        />
                        <input
                            className={`${styles.section_header_input} ${styles.section_header_input__price}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}                            
                        />
                        <button className={styles.section_header_confirm} onClick={handleSave}>
                            <GoCheck size={13} />
                        </button>
                        <button className={styles.section_header_cancel} onClick={handleCancel}>
                            <GoX size={13} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.section_header_view}>
                        <div className={styles.section_header_left}>
                            <span className={styles.section_header_label}>{queue.label}</span>
                            <span className={styles.section_header_count}>
                                {orders.length} {orders.length === 1 ? 'video' : 'videos'}
                            </span>
                        </div>
                        <div className={styles.section_header_right}>
                            <span className={styles.section_header_price}>
                                ${queue.pricePerMinute}
                                <span className={styles.section_header_price_unit}>/min</span>
                            </span>
                            {isOwner ? (
                                <div className={styles.section_header_actions}>
                                    <button
                                        className={styles.section_header_edit_btn}
                                        onClick={() => setEditing(true)}
                                        title="Edit queue"
                                    >
                                        <GoPencil size={12} />
                                    </button>
                                    <button
                                        className={styles.section_header_delete_btn}
                                        onClick={() => onDeleteQueue?.(queue.id)}
                                        title="Delete queue"
                                    >
                                        <GoTrash size={12} />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            {orders.length > 0 ? (
                <div className={styles.section_list}>
                    {orders.map((order) => (
                        <VideoCard
                            key={ order.id }
                            order={ order }
                            queue={ queue }
                            isOwner={ isOwner }
                            onRemove={ onRemoveOrder }
                            onExtend={ onExtend }
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