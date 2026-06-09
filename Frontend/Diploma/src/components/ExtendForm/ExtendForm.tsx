import { useState } from 'react'
import { GoCheck, GoX } from 'react-icons/go'
import type { IQueue } from '../../interfaces/interfaces'
import styles from './ExtendForm.module.scss'

interface Props {
    orderId: number
    queue: IQueue
    orderedMinutes: number
    totalMinutes: number
    onExtend: (orderId: number, additionalMinutes: number) => Promise<void>
    onCancel: () => void
}

const formatMinSec = (dec: number): string => {
    const m = Math.floor(dec)
    const s = Math.round((dec - m) * 60)
    return `${m}:${String(s).padStart(2, '0')}`
}

const ExtendForm = ({ orderId, queue, orderedMinutes, totalMinutes, onExtend, onCancel }: Props) => {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState('')

    const price = queue.price_per_minute
    const amountNum = parseFloat(amount)
    const additionalMinutes = !isNaN(amountNum) && amountNum > 0 ? amountNum / price : 0
    const remainingMinutes = totalMinutes - orderedMinutes
    const wouldExceed = totalMinutes > 0 && additionalMinutes > remainingMinutes

    const error = (() => {
        if (!amount) return ''
        if (isNaN(amountNum) || amountNum <= 0) return 'Enter a valid amount'
        if (amountNum < price) return `Min $${price.toFixed(2)}`
        if (wouldExceed) return `Max +${formatMinSec(remainingMinutes)} (video end)`
        return ''
    })()

    const canSubmit = amount && !error && additionalMinutes > 0 && !loading

    const handleConfirm = async () => {
        if (!canSubmit) return
        setLoading(true)
        setServerError('')
        try {
            await onExtend(orderId, parseFloat(additionalMinutes.toFixed(2)))
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Failed to extend')
            setLoading(false)
        }
    }

    return (
        <div className={styles.form}>
            <div className={styles.form_row}>
                <div className={styles.form_input_wrap}>
                    <span className={styles.form_currency}>$</span>
                    <input
                        className={`${styles.form_input} ${error ? styles.form_input__error : ''}`}
                        type="number"
                        min={price}
                        step="0.01"
                        placeholder={`${price.toFixed(2)}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoFocus
                    />
                </div>
                {additionalMinutes > 0 && !error && (
                    <span className={styles.form_result}>+{formatMinSec(additionalMinutes)} min</span>
                )}
                <button className={styles.form_confirm} onClick={handleConfirm} disabled={!canSubmit}>
                    <GoCheck size={14} />
                </button>
                <button className={styles.form_cancel} onClick={onCancel}>
                    <GoX size={14} />
                </button>
            </div>
            {error && <span className={styles.form_error}>{error}</span>}
            {serverError && <span className={styles.form_error}>{serverError}</span>}
            {totalMinutes > 0 && !error && (
                <span className={styles.form_hint}>{formatMinSec(remainingMinutes)} remaining in video</span>
            )}
        </div>
    )
}

export default ExtendForm