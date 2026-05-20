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

const formatMinSec = (minutes: number): string => {
    const m = Math.floor(minutes)
    const s = Math.round((minutes - m) * 60)
    return `${m}:${String(s).padStart(2, '0')}`
}

const ExtendForm = ({orderId, queue, orderedMinutes, totalMinutes, onExtend, onCancel }: Props) => {
    const [amount, setAmount] = useState('')
    const [serverError, setServerError] = useState('')

    const amountNum = parseFloat(amount)
    const additionalMinutes = !isNaN(amountNum) && amountNum > 0
        ? amountNum / queue.pricePerMinute
        : 0

    const remainingMinutes = totalMinutes - orderedMinutes

    const error = (() => {
        if (!amount) {
            return ''
        }

        if (isNaN(amountNum) || amountNum <= 0) {
            return 'Enter a valid amount'
        }

        return ''
    })()

    const canSubmit = amount && !error && additionalMinutes > 0

    const handleConfirm = async () => {
        if (!canSubmit) {
            return
        }

        setServerError('')
        try {
            await onExtend(orderId, parseFloat(additionalMinutes.toFixed(2)))
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Failed to extend')
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
                        min={ queue.pricePerMinute }
                        step="0.01"
                        placeholder={`${queue.pricePerMinute.toFixed(2)}`}
                        value={ amount }
                        onChange={(e) => setAmount(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        autoFocus
                    />
                </div>

                {additionalMinutes > 0 && !error ? (
                    <span className={styles.form_result}>
                        +{formatMinSec(additionalMinutes)} min
                    </span>
                ) : null}

                <button
                    className={styles.form_confirm}
                    onClick={ handleConfirm }
                    disabled={ !canSubmit }
                    title="Confirm"
                >
                    <GoCheck size={14} />
                </button>
                <button
                    className={styles.form_cancel}
                    onClick={ onCancel }
                    title="Cancel"
                >
                    <GoX size={14} />
                </button>
            </div>

            {error ? <span className={styles.form_error}>{error}</span> : null}
            {serverError ? <span className={styles.form_error}>{serverError}</span> : null}

            {totalMinutes > 0 && !error && (
                <span className={styles.form_hint}>
                    {formatMinSec(remainingMinutes)} remaining in video
                </span>
            )}
        </div>
    )
}

export default ExtendForm