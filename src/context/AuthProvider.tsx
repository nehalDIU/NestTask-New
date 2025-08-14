'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AuthContextType, AuthUser, SignupFormData, LoginFormData } from '@/types/auth'
import { getUserProfile } from '@/lib/fetchers'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const clearError = () => setError(null)

  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const userProfile = await getUserProfile(authUser.id, supabase)
        setUser({
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role,
          student_id: userProfile.student_id || undefined,
          department_id: userProfile.department_id || undefined,
          batch_id: userProfile.batch_id || undefined,
          section_id: userProfile.section_id || undefined,
          department: userProfile.department || undefined,
          batch: userProfile.batch || undefined,
          section: userProfile.section || undefined,
        })
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Error refreshing user:', err)
      setUser(null)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          await refreshUser()
        }
      } catch (err) {
        console.error('Error getting initial session:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (formData: SignupFormData) => {
    try {
      setLoading(true)
      setError(null)

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            student_id: formData.student_id,
            department_id: formData.department_id,
            batch_id: formData.batch_id,
            section_id: formData.section_id,
            role: 'user', // Default role
          })

        if (profileError) throw profileError

        return { success: true }
      }

      return { success: false, error: 'Failed to create account' }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (formData: LoginFormData) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        await refreshUser()
        return { success: true }
      }

      return { success: false, error: 'Failed to sign in' }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (err: any) {
      console.error('Error signing out:', err)
      setError(err.message || 'Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { success: true }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset email'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
