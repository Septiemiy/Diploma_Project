import { useState, useEffect } from 'react'
import { subscriptionsApi } from '../api/api'

export const useSubscription = (streamerId: string | undefined) => {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!streamerId) return
        subscriptionsApi.getMySubscriptions()
            .then((list: { id: string }[]) => {
                setIsSubscribed(list.some((s) => s.id === streamerId))
            })
            .catch(console.error)
    }, [streamerId])

    const toggle = async () => {
        if (!streamerId) return
        setLoading(true)
        try {
            if (isSubscribed) {
                await subscriptionsApi.unsubscribe(streamerId)
                setIsSubscribed(false)
            } else {
                await subscriptionsApi.subscribe(streamerId)
                setIsSubscribed(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return { isSubscribed, toggle, loading }
}