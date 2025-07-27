'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, Save } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createContext, useContext } from 'react'

// Create a context for save functionality
interface SaveContextType {
  saveFunction?: () => Promise<void>
  saving?: boolean
}

export const SaveContext = createContext<SaveContextType>({})

export function Navbar() {
  const { user, signOut } = useAuth()
  const { saveFunction, saving } = useContext(SaveContext)
  const pathname = usePathname()

  if (!user) return null

  // Determine save button text based on current page
  const getSaveButtonText = () => {
    if (pathname.includes('/mk')) return 'Save Points'
    if (pathname.includes('/bag')) return 'Save Bag'
    return 'Save'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link href="/bag" className="text-lg font-bold text-white hover:text-blue-300 transition-colors">
              Kingdom Guard
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {saveFunction && (
              <Button
                onClick={saveFunction}
                disabled={saving}
                size="sm"
                className="flex items-center space-x-1 bg-blue-600/80 hover:bg-blue-500 text-white text-xs h-8"
              >
                <Save className="h-3 w-3" />
                <span>{saving ? 'Saving...' : getSaveButtonText()}</span>
              </Button>
            )}
            <span className="text-xs text-slate-300">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-1 bg-red-600/20 hover:bg-red-600/30 border-red-500/50 text-red-300 hover:text-red-200 text-xs h-8"
            >
              <LogOut className="h-3 w-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
