export interface IUser {
    id: number;
    username: string;
}

export interface IQueue {
    id: number;
    label: string;
    pricePerMinute: number;
}

export interface IVideoOrder {
    id: number;
    youtubeUrl: string;
    title: string;
    thumbnail: string;
    orderedMinutes: number;
    totalMinutes: number;
    queueId: number;
    viewer?: IViewer;
    viewerUsername?: string;
}

export interface IStreamer {
    id: number;
    username: string;
    queues: IQueue[];
    orders: IVideoOrder[];
}

export interface IViewer {
    id: number;
    username: string;
}

export type DashboardMode = "viewer" | "streamer";