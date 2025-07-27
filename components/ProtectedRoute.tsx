'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar, SaveContext } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { NicknameSetup } from '@/components/NicknameSetup'

interface ProtectedRouteProps {
  children: React.ReactNode
  saveFunction?: () => Promise<void>
  saving?: boolean
}

export function ProtectedRoute({ children, saveFunction, saving }: ProtectedRouteProps) {
  const { user, loading, needsNickname } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show nickname setup if user needs to set a nickname
  if (needsNickname) {
    return <NicknameSetup />
  }

  return (
    <SaveContext.Provider value={{ saveFunction, saving }}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SaveContext.Provider>
  )
}
