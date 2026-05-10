import { useState, useEffect, useRef } from 'react'
import { GoX } from 'react-icons/go'
import { useDashboard } from '../../context/DashboardContext'
import { useYouTube } from '../../hooks/useYouTube'

import type { IQueue, IVideoOrder } from '../../interfaces/interfaces'

import styles from './OrderModal.module.scss'

interface Props {
    queues: IQueue[]
    onSubmit: (order: Omit<IVideoOrder, 'id' | 'status'>) => void
}

const OrderModal = ({ queues, onSubmit }: Props) => {
    const { isOrderModalOpen, closeOrderModal } = useDashboard()

    const [url, setUrl] = useState('')
    const [urlTouched, setUrlTouched] = useState(false)
    const [selectedQueueId, setSelectedQueueId] = useState<number | null>(queues.length > 0 ? queues[0].id : null)
    const [amount, setAmount] = useState('')
    const [durationInput, setDurationInput] = useState('')

    const { meta, loading, error: metaError, fetchMeta, reset } = useYouTube()

    const urlRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    const selectedQueue = queues.find((q) => q.id === selectedQueueId) ?? null
    const minAmount = selectedQueue ? selectedQueue.pricePerMinute : 0

    useEffect(() => {
        if (urlRef.current) clearTimeout(urlRef.current)
        
        if (!url.trim()) { 
            reset() 
            return 
        }

        urlRef.current = setTimeout(() => {
            fetchMeta(url)
        }, 800)

        return () => {
            if (urlRef.current) {
                clearTimeout(urlRef.current)
            }
        }
    }, [url])

    const amountNum = parseFloat(amount)
    const orderedMinutes =
        selectedQueue && !isNaN(amountNum) && amountNum > 0
            ? amountNum / selectedQueue.pricePerMinute
            : 0

    const totalMinutes = meta?.durationMinutes
        ? meta.durationMinutes
        : parseFloat(durationInput) || 0

    const urlError = urlTouched && !url.trim() ? 'YouTube URL is required' : ''
    
    const amountError = (() => {
        if (!amount) { 
            return ''
        }

        if (isNaN(amountNum) || amountNum <= 0) {
            return 'Enter a valid amount'
        }
        if (amountNum < minAmount) {
            return `Minimum is $${minAmount.toFixed(2)}`
        }
        
        return ''
    })()

    const canSubmit = url.trim() && meta && selectedQueue && !amountError && amountNum >= minAmount && totalMinutes != 0

    const handleSubmit = () => {
        if (!canSubmit || !meta || !selectedQueue) {
            return
        }

        onSubmit({
            youtubeUrl: url,
            title: meta.title,
            thumbnail: meta.thumbnail,
            queueId: selectedQueue.id,
            orderedMinutes: parseFloat(orderedMinutes.toFixed(2)),
            totalMinutes: totalMinutes || orderedMinutes,
            viewerUsername: 'me', // TODO: замінити на реального юзера з auth
        })

        handleClose()
    }

    const handleClose = () => {
        setUrl('')
        setUrlTouched(false)
        setAmount('')
        setDurationInput('')
        setSelectedQueueId(queues.length > 0 ? queues[0].id : null)
        reset()
        closeOrderModal()
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            handleClose()
        }
    }

    if (!isOrderModalOpen) return null

    return (
        <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modal_header}>
                    <div className={styles.modal_header_left}>
                        <span className={styles.modal_eyebrow}>Viewer</span>
                        <h2 className={styles.modal_title}>Order Video</h2>
                    </div>
                    <button className={styles.modal_close} onClick={handleClose}>
                        <GoX size={18} />
                    </button>
                </div>

                <div className={styles.modal_body}>
                    <div className={styles.field}>
                        <label className={styles.field_label}>YouTube URL</label>
                        <div className={styles.field_urlrow}>
                            <input
                                className={`${styles.field_input} ${(urlError || metaError) ? styles.field_input__error : ''} ${meta ? styles.field_input__success : ''}`}
                                type="text"
                                placeholder="https://youtube.com/watch?v=..."
                                value={ url }
                                onChange={(e) => setUrl(e.target.value)}
                                onBlur={() => setUrlTouched(true)}
                            />
                        </div>
                        {loading ? <span className={styles.field_hint}>Fetching video info...</span> : null}
                        {metaError ? <span className={styles.field_error}>{metaError}</span> : null}
                        {urlError ? <span className={styles.field_error}>{urlError}</span> : null}
                    </div>
                    {meta ? (
                        <div className={styles.preview}>
                            <img
                                src={meta.thumbnail}
                                alt={meta.title}
                                className={styles.preview_thumb}
                            />
                            <div className={styles.preview_info}>
                                <span className={styles.preview_title}>{meta.title}</span>
                                {meta.durationMinutes && (
                                    <span className={styles.preview_duration}>
                                        {Math.floor(meta.durationMinutes)}:{String(Math.round((meta.durationMinutes % 1) * 60)).padStart(2, '0')} total
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {meta && !meta.durationMinutes ? (
                        <div className={styles.field}>
                            <label className={styles.field_label}>
                                Video duration <span className={styles.field_label__muted}>(minutes, e.g. 3.5)</span>
                            </label>
                            <input
                                className={styles.field_input}
                                type="number"
                                min="0.1"
                                step="0.1"
                                placeholder="e.g. 3.5"
                                value={ durationInput }
                                onChange={(e) => setDurationInput(e.target.value)}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                    ) : null}

                    <div className={styles.field}>
                        <label className={styles.field_label}>Queue</label>
                        <div className={styles.queues}>
                            {queues.map((q) => (
                                <button
                                    key={ q.id }
                                    className={`${styles.queues_item} ${selectedQueueId === q.id ? styles.queues_item__active : ''}`}
                                    onClick={() => {
                                        setSelectedQueueId(q.id)
                                        setAmount('')
                                    }}
                                >
                                    <span className={styles.queues_item_label}>{q.label}</span>
                                    <span className={styles.queues_item_price}>
                                        ${q.pricePerMinute}<span className={styles.queues_item_unit}>/min</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field_label}>
                            Amount ($)
                            {selectedQueue && (
                                <span className={styles.field_label__muted}>
                                    {' '}— min ${selectedQueue.pricePerMinute.toFixed(2)}
                                </span>
                            )}
                        </label>
                        <input
                            className={`${styles.field_input} ${amountError ? styles.field_input__error : ''}`}
                            type="number"
                            min={ minAmount }
                            step="0.01"
                            placeholder={`$${minAmount.toFixed(2)}`}
                            value={ amount }
                            onChange={(e) => setAmount(e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                            disabled={ !selectedQueue }
                        />
                        {amountError ? <span className={styles.field_error}>{amountError}</span> : null}

                        {orderedMinutes > 0 && !amountError ? (
                            <div className={styles.calc}>
                                <span className={styles.calc_item}>
                                    <span className={styles.calc_label}>Ordered</span>
                                    <span className={styles.calc_value}>
                                        {Math.floor(orderedMinutes)}:{String(Math.round((orderedMinutes % 1) * 60)).padStart(2, '0')} min
                                    </span>
                                </span>
                                {totalMinutes > 0 ? (
                                    <span className={styles.calc_item}>
                                        <span className={styles.calc_label}>of total</span>
                                        <span className={styles.calc_value}>
                                            {Math.floor(totalMinutes)}:{String(totalMinutes).split(".")[1] || "00"} min
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className={styles.modal_footer}>
                    <button className={styles.modal_cancel} onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.modal_submit}
                        onClick={ handleSubmit }
                        disabled={ !canSubmit }
                    >
                        Order the Video
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderModal