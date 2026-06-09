import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextValue {
    user: User | null
    session: Session | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, username: string) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)
    }

    const register = async (email: string, password: string, username: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        })
        if (error) throw new Error(error.message)

        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
            await supabase.from('users').insert({
                id: userData.user.id,
                username,
                email,
            })
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!session,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}