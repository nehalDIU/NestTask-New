'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { resetPasswordSchema } from '@/lib/validators'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

type FormData = {
  email: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function PasswordResetForm() {
  const { resetPassword, loading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = resetPasswordSchema.parse(formData)
      const result = await resetPassword(validatedData.email)
      
      if (result.success) {
        setSuccess(true)
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

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a password reset link to <strong>{formData.email}</strong>
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Didn't receive the email? Check your spam folder or</p>
          <button
            onClick={() => setSuccess(false)}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            try again
          </button>
        </div>
        
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    )
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
          helperText="Enter the email address associated with your account"
          fullWidth
          required
          autoComplete="email"
        />
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
        Send reset link
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
