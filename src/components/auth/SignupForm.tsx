'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getDepartments, getBatchesByDepartment, getSectionsByBatch } from '@/lib/fetchers'
import { signupSchema } from '@/lib/validators'
import { ChevronLeft, ChevronRight, User, Mail, Lock, GraduationCap } from 'lucide-react'

type FormData = {
  email: string
  password: string
  confirmPassword: string
  name: string
  student_id: string
  department_id: string
  batch_id: string
  section_id: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function SignupForm() {
  const router = useRouter()
  const { signUp, loading, error, clearError } = useAuth()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    student_id: '',
    department_id: '',
    batch_id: '',
    section_id: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [departments, setDepartments] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    if (formData.department_id) {
      loadBatches(formData.department_id)
      setFormData(prev => ({ ...prev, batch_id: '', section_id: '' }))
    }
  }, [formData.department_id])

  useEffect(() => {
    if (formData.batch_id) {
      loadSections(formData.batch_id)
      setFormData(prev => ({ ...prev, section_id: '' }))
    }
  }, [formData.batch_id])

  const loadDepartments = async () => {
    try {
      setLoadingData(true)
      const data = await getDepartments()
      setDepartments(data)
    } catch (err) {
      console.error('Error loading departments:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const loadBatches = async (departmentId: string) => {
    try {
      setLoadingData(true)
      const data = await getBatchesByDepartment(departmentId)
      setBatches(data)
    } catch (err) {
      console.error('Error loading batches:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const loadSections = async (batchId: string) => {
    try {
      setLoadingData(true)
      const data = await getSectionsByBatch(batchId)
      setSections(data)
    } catch (err) {
      console.error('Error loading sections:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    clearError()
  }

  const validateStep = (stepNumber: number): boolean => {
    const stepErrors: FormErrors = {}

    if (stepNumber === 1) {
      if (!formData.email) stepErrors.email = 'Email is required'
      if (!formData.password) stepErrors.password = 'Password is required'
      if (!formData.confirmPassword) stepErrors.confirmPassword = 'Please confirm your password'
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (stepNumber === 2) {
      if (!formData.name) stepErrors.name = 'Name is required'
    } else if (stepNumber === 3) {
      if (!formData.department_id) stepErrors.department_id = 'Please select a department'
      if (!formData.batch_id) stepErrors.batch_id = 'Please select a batch'
      if (!formData.section_id) stepErrors.section_id = 'Please select a section'
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return

    try {
      const validatedData = signupSchema.parse(formData)
      const result = await signUp(validatedData)
      
      if (result.success) {
        router.push('/student')
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Mail className="mx-auto h-12 w-12 text-primary-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Account Information</h3>
              <p className="text-sm text-gray-500">Create your login credentials</p>
            </div>
            
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="your.email@diu.edu.bd"
              fullWidth
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter a strong password"
              fullWidth
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              fullWidth
              required
            />
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-primary-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Personal Information</h3>
              <p className="text-sm text-gray-500">Tell us about yourself</p>
            </div>
            
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter your full name"
              fullWidth
              required
            />
            
            <Input
              label="Student ID (Optional)"
              type="text"
              value={formData.student_id}
              onChange={(e) => handleInputChange('student_id', e.target.value)}
              error={errors.student_id}
              placeholder="XX-XXXXX-X"
              helperText="Format: XX-XXXXX-X (e.g., 22-12345-1)"
              fullWidth
            />
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <GraduationCap className="mx-auto h-12 w-12 text-primary-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Academic Information</h3>
              <p className="text-sm text-gray-500">Select your department, batch, and section</p>
            </div>
            
            {loadingData ? (
              <LoadingSpinner text="Loading academic data..." />
            ) : (
              <>
                <Select
                  label="Department"
                  value={formData.department_id}
                  onChange={(e) => handleInputChange('department_id', e.target.value)}
                  error={errors.department_id}
                  placeholder="Select your department"
                  options={departments.map(dept => ({
                    value: dept.id,
                    label: dept.name
                  }))}
                  fullWidth
                  required
                />
                
                <Select
                  label="Batch"
                  value={formData.batch_id}
                  onChange={(e) => handleInputChange('batch_id', e.target.value)}
                  error={errors.batch_id}
                  placeholder="Select your batch"
                  options={batches.map(batch => ({
                    value: batch.id,
                    label: batch.name
                  }))}
                  disabled={!formData.department_id}
                  fullWidth
                  required
                />
                
                <Select
                  label="Section"
                  value={formData.section_id}
                  onChange={(e) => handleInputChange('section_id', e.target.value)}
                  error={errors.section_id}
                  placeholder="Select your section"
                  options={sections.map(section => ({
                    value: section.id,
                    label: section.name
                  }))}
                  disabled={!formData.batch_id}
                  fullWidth
                  required
                />
              </>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === step
                ? 'bg-primary-600 text-white'
                : stepNumber < step
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNumber}
          </div>
        ))}
      </div>

      {renderStep()}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            loading={loading}
            disabled={loadingData}
          >
            Create Account
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
