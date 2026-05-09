export interface Queue {
    id: number;
    label: string;
    pricePerMinute: number;
}

export interface VideoOrder {
    id: number;
    youtubeUrl: string;
    title: string;
    thumbnail: string;
    orderedMinutes: number;
    totalMinutes: number;
    queueId: number;
    viewerUsername: string;
    status: "pending" | "watching" | "done";
}

export interface Streamer {
    id: number;
    username: string;
    avatar?: string;
    queues: Queue[];
    orders: VideoOrder[];
}

export interface Viewer {
    id: number;
    username: string;
    avatar?: string;
}

export type DashboardMode = "viewer" | "streamer";