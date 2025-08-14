'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase'
import { createTaskSchema } from '@/lib/validators'
import { TASK_CATEGORIES } from '@/lib/constants'
import { ArrowLeft, Plus, X } from 'lucide-react'

type FormData = {
  title: string
  description: string
  due_date: string
  category: string
  files: File[]
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function CreateTaskPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    due_date: '',
    category: 'general',
    files: []
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleInputChange = (field: keyof FormData, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleInputChange('files', files)
  }

  const removeFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index)
    handleInputChange('files', newFiles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.section_id) {
      setError('Section information not found')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Validate form data
      const validatedData = createTaskSchema.parse({
        title: formData.title,
        description: formData.description || undefined,
        due_date: formData.due_date || undefined,
        category: formData.category,
        section_id: user.section_id,
        files: [] // For now, we'll handle file uploads separately
      })

      // Create task in database
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: validatedData.title,
          description: validatedData.description,
          due_date: validatedData.due_date,
          category: validatedData.category,
          section_id: validatedData.section_id,
          created_by: user.id,
          files: []
        })
        .select()
        .single()

      if (taskError) throw taskError

      // Create user_tasks entries for all students in the section
      const { data: students } = await supabase
        .from('users')
        .select('id')
        .eq('section_id', user.section_id)
        .eq('role', 'user')

      if (students && students.length > 0) {
        const userTasks = students.map(student => ({
          user_id: student.id,
          task_id: task.id,
          status: 'pending' as const
        }))

        const { error: userTasksError } = await supabase
          .from('user_tasks')
          .insert(userTasks)

        if (userTasksError) throw userTasksError
      }

      router.push('/tasks')

    } catch (err: any) {
      console.error('Error creating task:', err)
      if (err.errors) {
        const zodErrors: FormErrors = {}
        err.errors.forEach((error: any) => {
          zodErrors[error.path[0] as keyof FormData] = error.message
        })
        setErrors(zodErrors)
      } else {
        setError(err.message || 'Failed to create task')
      }
    } finally {
      setLoading(false)
    }
  }

  // Check if user has permission to create tasks
  if (user?.role === 'user') {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have permission to create tasks.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a task for your section students
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            placeholder="Enter task title"
            fullWidth
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="input w-full"
              placeholder="Enter task description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Due Date"
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              error={errors.due_date}
              fullWidth
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={errors.category}
              options={TASK_CATEGORIES.map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
              }))}
              fullWidth
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, XLS, PPT, TXT, images up to 10MB each
                </p>
              </div>
            </div>

            {/* File List */}
            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
