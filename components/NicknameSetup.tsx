'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function NicknameSetup() {
  const { user, updateProfile } = useAuth()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nickname.trim()) {
      toast.error('Nickname is required')
      return
    }

    setLoading(true)
    try {
      const { error } = await updateProfile(nickname.trim())
      if (error) {
        toast.error('Failed to set nickname. Please try again.')
      } else {
        toast.success('Nickname set successfully!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm border-slate-600">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Set Your Nickname</CardTitle>
          <CardDescription className="text-slate-300">
            To continue using Kingdom Guard, please choose a nickname that will be displayed in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-slate-700/50 border-slate-600 text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-slate-200">Nickname *</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                maxLength={50}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                autoFocus
              />
              <p className="text-xs text-slate-400">
                This nickname will be displayed throughout the application and is required to continue.
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500" 
              disabled={loading || !nickname.trim()}
            >
              {loading ? 'Setting Nickname...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
