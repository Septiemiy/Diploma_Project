import type { IStreamer } from '../interfaces/interfaces'

const MOCK_STREAMERS: Record<string, IStreamer> = {
    '1': {
        id: '1',
        username: 'xQc',
        queues: [
            { id: 1, label: 'Queue 1', price_per_minute: 1, video_orders: [] },
            { id: 2, label: 'Queue 2', price_per_minute: 2, video_orders: [] },
            { id: 3, label: 'Queue 3', price_per_minute: 3, video_orders: [] },
        ],
    },
    '2': {
        id: '2',
        username: 'Asmongold',
        queues: [
            { id: 1, label: 'Bronze', price_per_minute: 1, video_orders: [] },
            { id: 2, label: 'Gold', price_per_minute: 5, video_orders: [] },
        ],
    },
}

export const getMockStreamer = (id: string): IStreamer | null => {
    return MOCK_STREAMERS[id] ?? null
}