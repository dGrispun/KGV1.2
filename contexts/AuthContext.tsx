'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  needsNickname: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nickname: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (nickname: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsNickname, setNeedsNickname] = useState(false)
  const supabase = createClient()

  // Function to load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading user profile:', error)
        return
      }

      if (data) {
        setUserProfile(data)
        setNeedsNickname(false)
      } else {
        // User doesn't have a profile yet, they need to set a nickname
        setUserProfile(null)
        setNeedsNickname(true)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setNeedsNickname(true)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUserProfile(null)
          setNeedsNickname(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, nickname: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // If sign up was successful and user is created, create the profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            nickname: nickname.trim()
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Note: We still return success for auth, profile can be created later
        }
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (nickname: string) => {
    if (!user) return { error: new Error('No user logged in') }

    if (!nickname.trim()) {
      return { error: new Error('Nickname is required') }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          nickname: nickname.trim(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        return { error }
      }

      // Reload the user profile
      await loadUserProfile(user.id)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    needsNickname,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
