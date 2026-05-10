import { useState } from 'react'

interface YouTube {
    title: string
    thumbnail: string
    durationMinutes: number | null
}

interface UseYouTubeReturn {
    meta: YouTube | null
    loading: boolean
    error: string
    fetchMeta: (url: string) => Promise<void>
    reset: () => void
}

const extractVideoId = (url: string): string | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
            return match[1]
        }
    }
    return null
}

export const useYouTube = (): UseYouTubeReturn => {
    const [meta, setMeta] = useState<YouTube | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchMeta = async (url: string) => {
        const videoId = extractVideoId(url)
        
        if (!videoId) {
            setError('Invalid YouTube URL')
            setMeta(null)
            return
        }

        setLoading(true)
        setError('')
        setMeta(null)

        try {
            const oembedRes = await fetch(
                `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
            )

            if (!oembedRes.ok) {
                throw new Error('Video not found or unavailable')
            }

            const oembedData = await oembedRes.json()

            let durationMinutes: number | null = null
            try {
                const noembedRes = await fetch(
                    `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
                )
                const noembedData = await noembedRes.json()
                console.log(noembedData)
            } catch {
                
            }

            setMeta({
                title: oembedData.title,
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                durationMinutes,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch video info')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setMeta(null)
        setError('')
        setLoading(false)
    }

    return { meta, loading, error, fetchMeta, reset }
}