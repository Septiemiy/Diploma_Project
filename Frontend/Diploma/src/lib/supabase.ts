import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://znrmckskzjhsmzbinlbb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpucm1ja3Nrempoc216YmlubGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzk0NjYsImV4cCI6MjA5NDcxNTQ2Nn0._d4hFw47RmvbvTOATvVIEWbjkeS-xaG46OZdQHSQ6qI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)