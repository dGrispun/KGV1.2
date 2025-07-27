'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LogOut, Save, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createContext, useContext } from 'react'
import { toast } from 'sonner'

// Create a context for save functionality
interface SaveContextType {
  saveFunction?: () => Promise<void>
  saving?: boolean
}

export const SaveContext = createContext<SaveContextType>({})

export function Navbar() {
  const { user, userProfile, signOut, updateProfile } = useAuth()
  const { saveFunction, saving } = useContext(SaveContext)
  const pathname = usePathname()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [nickname, setNickname] = useState(userProfile?.nickname || '')
  const [profileSaving, setProfileSaving] = useState(false)

  // Update nickname when userProfile changes
  useEffect(() => {
    setNickname(userProfile?.nickname || '')
  }, [userProfile?.nickname])

  if (!user) return null

  // Determine save button text based on current page
  const getSaveButtonText = () => {
    if (pathname.includes('/mk')) return 'Save Points'
    if (pathname.includes('/bag')) return 'Save Bag'
    return 'Save'
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const { error } = await updateProfile(nickname)
      if (error) {
        toast.error('Failed to update profile')
      } else {
        toast.success('Profile updated successfully!')
        setIsProfileOpen(false)
      }
    } finally {
      setProfileSaving(false)
    }
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
            {userProfile && (
              <span className="text-sm font-medium text-blue-300">
                {userProfile.nickname}
              </span>
            )}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300 hover:text-purple-200 text-xs h-8"
                >
                  <User className="h-3 w-3" />
                  <span>Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                  <DialogDescription className="text-slate-300">
                    Update your profile information. Your nickname will be displayed in the navbar.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-slate-200 font-medium">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-slate-700/50 border-slate-600 text-slate-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-sm text-slate-200 font-medium">Nickname *</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname"
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsProfileOpen(false)
                      setNickname(userProfile?.nickname || '')
                    }} 
                    className="text-sm border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleProfileSave} 
                    disabled={profileSaving || !nickname.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-sm disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
