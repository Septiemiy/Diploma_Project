import type { IStreamer } from '../interfaces/interfaces'

const MOCK_STREAMERS: Record<number, IStreamer> = {
    1: {
        id: 1,
        username: 'xQc',
        queues: [
            { id: 1, label: 'Queue 1', pricePerMinute: 1 },
            { id: 2, label: 'Queue 2', pricePerMinute: 2 },
            { id: 3, label: 'Queue 3', pricePerMinute: 3 },
            { id: 4, label: 'Queue 4', pricePerMinute: 4 },
            { id: 5, label: 'Queue 5', pricePerMinute: 5 },
        ],
        orders: [
            {
                id: 101,
                queueId: 5,
                youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
                title: 'Rick Astley - Never Gonna Give You Up',
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
                totalMinutes: 3.5,
                orderedMinutes: 2,
                viewerUsername: 'viewer_one',
            },
            {
                id: 102,
                queueId: 3,
                youtubeUrl: 'https://youtube.com/watch?v=kXYiU_JCYtU',
                title: 'Linkin Park - Numb',
                thumbnail: 'https://img.youtube.com/vi/kXYiU_JCYtU/mqdefault.jpg',
                totalMinutes: 3.08,
                orderedMinutes: 2,
                viewerUsername: 'nightwatcher',
            },
        ],
    },
    2: {
        id: 2,
        username: 'Asmongold',
        queues: [
            { id: 1, label: 'Bronze', pricePerMinute: 1 },
            { id: 2, label: 'Silver', pricePerMinute: 3 },
            { id: 3, label: 'Gold', pricePerMinute: 7 },
        ],
        orders: [
            {
                id: 201,
                queueId: 3,
                youtubeUrl: 'https://youtube.com/watch?v=9bZkp7q19f0',
                title: 'PSY - GANGNAM STYLE',
                thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg',
                totalMinutes: 4.13,
                orderedMinutes: 4.13,
                viewerUsername: 'gamer_xyz',
            },
        ],
    },
    3: {
        id: 3,
        username: 'ubermarginal',
        queues: [
            { id: 1, label: 'Standard', pricePerMinute: 2 },
            { id: 2, label: 'Priority', pricePerMinute: 6 },
        ],
        orders: [],
    },
    4: {
        id: 4,
        username: 'Jeens',
        queues: [
            { id: 1, label: 'Queue 1', pricePerMinute: 1 },
            { id: 2, label: 'Queue 2', pricePerMinute: 2 },
        ],
        orders: [
            {
                id: 401,
                queueId: 2,
                youtubeUrl: 'https://youtube.com/watch?v=fJ9rUzIMcZQ',
                title: 'Queen - Bohemian Rhapsody',
                thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
                totalMinutes: 5.55,
                orderedMinutes: 3,
                viewerUsername: 'viewer_one',
            },
        ],
    },
}

export const getMockStreamer = (id: number): IStreamer | null => {
    return MOCK_STREAMERS[id] ?? null
}