'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginSchema } from '@/lib/validators'
import { Mail, Lock } from 'lucide-react'

type FormData = {
  email: string
  password: string
  remember: boolean
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, loading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = loginSchema.parse(formData)
      const result = await signIn(validatedData)
      
      if (result.success) {
        const redirectTo = searchParams.get('redirectTo') || '/student'
        router.push(redirectTo)
      }
    } catch (err: any) {
      if (err.errors) {
        const zodErrors: FormErrors = {}
        err.errors.forEach((error: any) => {
          zodErrors[error.path[0] as keyof FormData] = error.message
        })
        setErrors(zodErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="your.email@diu.edu.bd"
          leftIcon={<Mail className="h-4 w-4" />}
          fullWidth
          required
          autoComplete="email"
        />
        
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          fullWidth
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={formData.remember}
            onChange={(e) => handleInputChange('remember', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link
            href="/reset-password"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
      >
        Sign in
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}
