import { useState, useEffect } from 'react'
import { subscriptionsApi } from '../api/api'

export const useSubscription = (streamerId: number | undefined) => {
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (!streamerId) {
            return
        }

        subscriptionsApi.getMySubscriptions().then((list: { id: number }[]) => {
            setIsSubscribed(list.some((streamer) => streamer.id === streamerId))
        }).catch(console.error)
    }, [streamerId])

    const toggle = async () => {
        if (!streamerId) {
            return
        }
        
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
        }
    }

    return { isSubscribed, toggle }
}