'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { TaskCard } from '@/components/dashboard/TaskCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { getTasks } from '@/lib/fetchers'
import { createClient } from '@/lib/supabase'
import { TaskWithDetails, TaskFilters } from '@/types/task'
import { TASK_STATUS, TASK_CATEGORIES } from '@/lib/constants'
import { Search, Filter, Plus } from 'lucide-react'

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    if (user?.section_id) {
      loadTasks()
    }
  }, [user, filters])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const tasksData = await getTasks({
        filters: {
          ...filters,
          section_id: user?.section_id,
          search: searchQuery || undefined
        },
        sort_by: 'due_date',
        sort_order: 'asc'
      }, supabase)

      // Load user's task completions
      const tasksWithUserStatus = await Promise.all(
        tasksData.map(async (task) => {
          const { data: userTask } = await supabase
            .from('user_tasks')
            .select('*')
            .eq('task_id', task.id)
            .eq('user_id', user?.id)
            .single()

          return { ...task, user_task: userTask }
        })
      )

      setTasks(tasksWithUserStatus)

    } catch (err) {
      console.error('Error loading tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .upsert({
          user_id: user?.id,
          task_id: taskId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              user_task: { 
                id: '', 
                user_id: user?.id || '', 
                task_id: taskId, 
                status: 'completed' as const,
                completed_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              }
            }
          : task
      ))

    } catch (err) {
      console.error('Error completing task:', err)
      setError('Failed to complete task')
    }
  }

  const handleSearch = () => {
    loadTasks()
  }

  const handleFilterChange = (field: keyof TaskFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading tasks..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your section tasks and track your progress
          </p>
        </div>
        
        {user?.role !== 'user' && (
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select
            placeholder="Filter by status"
            value={filters.status?.[0] || ''}
            onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : undefined)}
            options={[
              { value: '', label: 'All statuses' },
              ...Object.values(TASK_STATUS).map(status => ({
                value: status,
                label: status.replace('_', ' ').toUpperCase()
              }))
            ]}
          />
          
          <Select
            placeholder="Filter by category"
            value={filters.category?.[0] || ''}
            onChange={(e) => handleFilterChange('category', e.target.value ? [e.target.value] : undefined)}
            options={[
              { value: '', label: 'All categories' },
              ...TASK_CATEGORIES.map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
              }))
            ]}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={handleSearch} size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Tasks List */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              showActions={user?.role === 'user'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
