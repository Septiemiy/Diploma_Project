import { useState, useEffect, useRef } from 'react'
import { GoX, GoLinkExternal } from 'react-icons/go'
import { useDashboard } from '../../context/DashboardContext'
import { useYouTube } from '../../hooks/useYouTube'
import { ordersApi } from '../../api/api'
import type { IQueue, IVideoOrder } from '../../interfaces/interfaces'
import styles from './OrderModal.module.scss'

const parseDuration = (val: string): number | null => {
    const trimmed = val.trim()
    if (!trimmed) return null
    const mmss = trimmed.match(/^(\d+):([0-5]?\d)$/)
    if (mmss) {
        const mins = parseInt(mmss[1], 10)
        const secs = parseInt(mmss[2], 10)
        return mins + secs / 60
    }
    const num = parseFloat(trimmed)
    if (!isNaN(num) && num > 0) return num
    return null
}

const formatMinSec = (dec: number): string => {
    const m = Math.floor(dec)
    const s = Math.round((dec - m) * 60)
    return `${m}:${String(s).padStart(2, '0')}`
}

interface Props {
    queues: IQueue[]
    onSubmit: (order: Omit<IVideoOrder, 'id' | 'status'>) => void
}

const OrderModal = ({ queues, onSubmit }: Props) => {
    const { isOrderModalOpen, closeOrderModal } = useDashboard()

    const [url, setUrl] = useState('')
    const [urlTouched, setUrlTouched] = useState(false)
    const [selectedQueueId, setSelectedQueueId] = useState<number | null>(
        queues.length > 0 ? queues[0].id : null
    )
    const [amount, setAmount] = useState('')
    const [durationInput, setDurationInput] = useState('')
    const [serverError, setServerError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const { meta, loading, error: metaError, fetchMeta, reset } = useYouTube()
    const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    const selectedQueue = queues.find((q) => q.id === selectedQueueId) ?? null
    const minAmount = selectedQueue ? selectedQueue.price_per_minute : 0

    useEffect(() => {
        if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current)
        if (!url.trim()) { reset(); return }
        urlDebounceRef.current = setTimeout(() => fetchMeta(url), 800)
        return () => { if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current) }
    }, [url])

    const amountNum = parseFloat(amount)
    const totalMinutes = parseDuration(durationInput) ?? 0
    const orderedMinutes = selectedQueue && !isNaN(amountNum) && amountNum > 0
        ? amountNum / selectedQueue.price_per_minute
        : 0

    const urlError = urlTouched && !url.trim() ? 'YouTube URL is required' : ''

    const amountError = (() => {
        if (!amount) return ''
        if (isNaN(amountNum) || amountNum <= 0) return 'Enter a valid amount'
        if (amountNum < minAmount) return `Minimum is $${minAmount.toFixed(2)}`
        if (totalMinutes > 0 && orderedMinutes > totalMinutes)
            return `Cannot exceed video duration (${formatMinSec(totalMinutes)})`
        return ''
    })()

    const canSubmit =
        url.trim() &&
        meta &&
        selectedQueue &&
        !amountError &&
        amountNum >= minAmount &&
        totalMinutes > 0 &&
        !submitting

    const handleSubmit = async () => {
        if (!canSubmit || !meta || !selectedQueue) return

        setSubmitting(true)
        setServerError('')

        try {
            const newOrder = await ordersApi.create({
                youtubeUrl: url,
                title: meta.title,
                thumbnail: meta.thumbnail,
                queueId: selectedQueue.id,
                orderedMinutes: parseFloat(orderedMinutes.toFixed(2)),
                totalMinutes,
            })
            handleClose()
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Failed to place order')
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setUrl('')
        setUrlTouched(false)
        setAmount('')
        setDurationInput('')
        setSelectedQueueId(queues.length > 0 ? queues[0].id : null)
        setServerError('')
        reset()
        closeOrderModal()
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) handleClose()
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
        if (isOrderModalOpen) document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [isOrderModalOpen])

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
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onBlur={() => setUrlTouched(true)}
                            />
                            {url && (
                                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.field_urlopen}>
                                    <GoLinkExternal size={15} />
                                </a>
                            )}
                        </div>
                        {loading && <span className={styles.field_hint}>Fetching video info...</span>}
                        {metaError && <span className={styles.field_error}>{metaError}</span>}
                        {urlError && <span className={styles.field_error}>{urlError}</span>}
                    </div>

                    {meta && (
                        <div className={styles.preview}>
                            <img src={meta.thumbnail} alt={meta.title} className={styles.preview_thumb} />
                            <div className={styles.preview_info}>
                                <span className={styles.preview_title}>{meta.title}</span>
                            </div>
                        </div>
                    )}

                    <div className={styles.field}>
                        <label className={styles.field_label}>
                            Video duration
                            <span className={styles.field_label__muted}> (MM:SS, e.g. 3:45)</span>
                        </label>
                        <input
                            className={styles.field_input}
                            type="text"
                            placeholder="e.g. 3:45"
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field_label}>Queue</label>
                        <div className={styles.queues}>
                            {queues.map((q) => (
                                <button
                                    key={q.id}
                                    className={`${styles.queues_item} ${selectedQueueId === q.id ? styles.queues_item__active : ''}`}
                                    onClick={() => { setSelectedQueueId(q.id); setAmount('') }}
                                >
                                    <span className={styles.queues_item_label}>{q.label}</span>
                                    <span className={styles.queues_item_price}>
                                        ${q.price_per_minute}
                                        <span className={styles.queues_item_unit}>/min</span>
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
                                    {' '}— min ${selectedQueue.price_per_minute.toFixed(2)}
                                </span>
                            )}
                        </label>
                        <input
                            className={`${styles.field_input} ${amountError ? styles.field_input__error : ''}`}
                            type="number"
                            min={minAmount}
                            step="0.01"
                            placeholder={`$${minAmount.toFixed(2)}`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={!selectedQueue}
                        />
                        {amountError && <span className={styles.field_error}>{amountError}</span>}

                        {orderedMinutes > 0 && !amountError && (
                            <div className={styles.calc}>
                                <span className={styles.calc_item}>
                                    <span className={styles.calc_label}>Ordered</span>
                                    <span className={styles.calc_value}>{formatMinSec(orderedMinutes)} min</span>
                                </span>
                                {totalMinutes > 0 && (
                                    <span className={styles.calc_item}>
                                        <span className={styles.calc_label}>of total</span>
                                        <span className={styles.calc_value}>{formatMinSec(totalMinutes)} min</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {serverError && (
                        <span className={styles.field_error}>{serverError}</span>
                    )}
                </div>

                <div className={styles.modal_footer}>
                    <button className={styles.modal_cancel} onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.modal_submit}
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                    >
                        {submitting ? 'Placing...' : `Place Order — $${amount || '0.00'}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderModal