import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('your_supabase_url_here') || 
        supabaseAnonKey.includes('your_anon_key_here')) {
      throw new Error(
        'Missing or invalid Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.'
      )
    }

    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Type definitions for our database tables
export interface BagItem {
  id: string
  user_id: string
  item_name: string
  quantity: number
  created_at?: string
  updated_at?: string
}

export interface MKPoint {
  id: string
  user_id: string
  day: string
  item_name: string
  points_per_unit: number
  created_at?: string
  updated_at?: string
}

export interface Database {
  public: {
    Tables: {
      bag_items: {
        Row: BagItem
        Insert: Omit<BagItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BagItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      mk_points: {
        Row: MKPoint
        Insert: Omit<MKPoint, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MKPoint, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
