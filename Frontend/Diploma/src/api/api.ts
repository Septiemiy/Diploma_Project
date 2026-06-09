import { supabase } from '../lib/supabase'

export const streamersApi = {
    getById: async (id: string) => {
        const { data, error } = await supabase
            .from('users')
            .select(`
                id, username,
                queues (
                    id, label, price_per_minute,
                    video_orders (
                        id, youtube_url, title, thumbnail,
                        ordered_minutes, total_minutes, status,
                        viewer:users!viewer_id (id, username)
                    )
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw new Error(error.message)
        return data
    },

    getMe: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')
        return streamersApi.getById(user.id)
    },

    search: async (q: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, username')
            .ilike('username', `%${q}%`)
            .limit(10)

        if (error) throw new Error(error.message)
        return data
    },
}

export const queuesApi = {
    create: async (label: string, pricePerMinute: number) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('queues')
            .insert({ label, price_per_minute: pricePerMinute, streamer_id: user.id })
            .select()
            .single()

        if (error) throw new Error(error.message)
        return data
    },

    update: async (id: number, label: string, pricePerMinute: number) => {
        const { data, error } = await supabase
            .from('queues')
            .update({ label, price_per_minute: pricePerMinute })
            .eq('id', id)
            .select()
            .single()

        if (error) throw new Error(error.message)
        return data
    },

    delete: async (id: number) => {
        const { error } = await supabase
            .from('queues')
            .delete()
            .eq('id', id)

        if (error) throw new Error(error.message)
    },
}

export const ordersApi = {
    create: async (body: {
        youtubeUrl: string
        title: string
        thumbnail: string
        queueId: number
        orderedMinutes: number
        totalMinutes: number
    }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('video_orders')
            .insert({
                youtube_url: body.youtubeUrl,
                title: body.title,
                thumbnail: body.thumbnail,
                queue_id: body.queueId,
                viewer_id: user.id,
                ordered_minutes: body.orderedMinutes,
                total_minutes: body.totalMinutes,
                status: 'pending',
            })
            .select()
            .single()

        if (error) throw new Error(error.message)
        return data
    },

    extend: async (id: number, additionalMinutes: number) => {
        const { data: order, error: fetchError } = await supabase
            .from('video_orders')
            .select('ordered_minutes')
            .eq('id', id)
            .single()

        if (fetchError) throw new Error(fetchError.message)

        const newMinutes = parseFloat(
            (order.ordered_minutes + additionalMinutes).toFixed(2)
        )

        const { error } = await supabase
            .from('video_orders')
            .update({ ordered_minutes: newMinutes })
            .eq('id', id)

        if (error) throw new Error(error.message)
        return { orderId: id, newMinutes }
    },

    delete: async (id: number) => {
        const { error } = await supabase
            .from('video_orders')
            .delete()
            .eq('id', id)

        if (error) throw new Error(error.message)
    },
}

export const subscriptionsApi = {
    getMySubscriptions: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('subscriptions')
            .select('streamer:users!streamer_id (id, username)')
            .eq('viewer_id', user.id)

        if (error) throw new Error(error.message)
        return data?.map((s: any) => s.streamer) ?? []
    },

    getMySubscribers: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('subscriptions')
            .select('viewer:users!viewer_id (id, username)')
            .eq('streamer_id', user.id)

        if (error) throw new Error(error.message)
        return data?.map((s: any) => s.viewer) ?? []
    },

    subscribe: async (streamerId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
            .from('subscriptions')
            .upsert({ viewer_id: user.id, streamer_id: streamerId })

        if (error) throw new Error(error.message)
    },

    unsubscribe: async (streamerId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('viewer_id', user.id)
            .eq('streamer_id', streamerId)

        if (error) throw new Error(error.message)
    },
}