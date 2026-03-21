'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="h-10 w-40 bg-white/5 animate-pulse rounded-full border border-white/10 backdrop-blur-md"></div>
    )
  }

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

    return (
      <div className="flex items-center gap-2 p-1 pr-2 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-full shadow-lg transition-all duration-300" style={{ height: '40px' }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="flex-shrink-0 rounded-full border border-white/30 object-cover" style={{ width: '32px', height: '32px' }} />
        ) : (
          <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border border-white/30 shadow-inner" style={{ width: '32px', height: '32px' }}>
            <span className="text-white text-sm font-bold" style={{ fontSize: '14px' }}>{name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span className="text-sm font-medium text-white drop-shadow-sm px-1 max-w-[100px] truncate">
          {name}
        </span>
        <div className="w-px h-4 bg-white/20 mx-1 flex-shrink-0"></div>
        <button
          onClick={handleSignOut}
          className="p-1 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-all duration-300 group flex-shrink-0"
          style={{ width: '28px', height: '28px' }}
          title="Sign Out"
        >
          <svg width="16" height="16" className="group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="group relative flex items-center gap-3 px-5 py-2  backdrop-blur-md rounded-full overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:-translate-y-0.5"
    >
      <div className="relative flex flex-shrink-0 items-center justify-center w-7 h-7 bg-white rounded-full p-[5px] shadow-sm transform group-hover:scale-105 transition-transform duration-300">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </div>
      
      <span className="relative text-sm font-semibold text-white tracking-wide transition-colors">
        Sign in with Google
      </span>
    </button>
  )
}
