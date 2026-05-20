const BASE_URL = import.meta.env.API_URL ?? 'http://localhost:3000/api'

const getToken = () => localStorage.getItem('token')

const headers = (withAuth = true): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(withAuth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
})

const handleResponse = async (res: Response) => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? 'Something went wrong')
    return data
}

export const authApi = {
    register: (body: { username: string; email: string; password: string }) =>
        fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify(body),
        }).then(handleResponse),

    login: (body: { email: string; password: string }) =>
        fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify(body),
        }).then(handleResponse),
}

export const streamersApi = {
    getById: (id: number) =>
        fetch(`${BASE_URL}/streamers/${id}`, {
            headers: headers(),
        }).then(handleResponse),

    getMe: () =>
        fetch(`${BASE_URL}/streamers/me`, {
            headers: headers(),
        }).then(handleResponse),

    search: (q: string) =>
        fetch(`${BASE_URL}/streamers/search?q=${encodeURIComponent(q)}`, {
            headers: headers(),
        }).then(handleResponse),
}

export const queuesApi = {
    create: (body: { label: string; pricePerMinute: number }) =>
        fetch(`${BASE_URL}/queues`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(body),
        }).then(handleResponse),

    update: (id: number, body: { label?: string; pricePerMinute?: number }) =>
        fetch(`${BASE_URL}/queues/${id}`, {
            method: 'PATCH',
            headers: headers(),
            body: JSON.stringify(body),
        }).then(handleResponse),

    delete: (id: number) =>
        fetch(`${BASE_URL}/queues/${id}`, {
            method: 'DELETE',
            headers: headers(),
        }).then(handleResponse),
}

export const ordersApi = {
    create: (body: {
        youtubeUrl: string
        title: string
        thumbnail: string
        queueId: number
        orderedMinutes: number
        totalMinutes: number
    }) =>
        fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(body),
        }).then(handleResponse),

    extend: (id: number, additionalMinutes: number) =>
        fetch(`${BASE_URL}/orders/${id}/extend`, {
            method: 'PATCH',
            headers: headers(),
            body: JSON.stringify({ additionalMinutes }),
        }).then(handleResponse),

    delete: (id: number) =>
        fetch(`${BASE_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: headers(),
        }).then(handleResponse),
}

export const subscriptionsApi = {
    getMySubscriptions: () =>
        fetch(`${BASE_URL}/subscriptions/my`, {
            headers: headers(),
        }).then(handleResponse),

    getMySubscribers: () =>
        fetch(`${BASE_URL}/subscriptions/subscribers`, {
            headers: headers(),
        }).then(handleResponse),

    subscribe: (streamerId: number) =>
        fetch(`${BASE_URL}/subscriptions/${streamerId}`, {
            method: 'POST',
            headers: headers(),
        }).then(handleResponse),

    unsubscribe: (streamerId: number) =>
        fetch(`${BASE_URL}/subscriptions/${streamerId}`, {
            method: 'DELETE',
            headers: headers(),
        }).then(handleResponse),
}