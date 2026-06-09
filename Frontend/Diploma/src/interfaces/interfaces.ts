export type DashboardMode = 'viewer' | 'streamer'

export interface IUser {
    id: string
    username: string
}

export interface IQueue {
    id: number
    label: string
    price_per_minute: number
    pricePerMinute?: number
}

export interface IVideoOrder {
    id: number
    youtube_url: string
    title: string
    thumbnail: string
    ordered_minutes: number
    total_minutes: number
    queue_id: number
    queueId?: number
    status: 'pending' | 'watching' | 'done'
    viewer?: { id: string; username: string }
    viewerUsername?: string
}

export interface IStreamer {
    id: string
    username: string
    queues: (IQueue & { video_orders: IVideoOrder[] })[]
}

export interface IViewer {
    id: string
    username: string
}