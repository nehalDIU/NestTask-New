'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { TaskCard } from '@/components/dashboard/TaskCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { getTasks, getTaskStats } from '@/lib/fetchers'
import { createClient } from '@/lib/supabase'
import { TaskWithDetails, TaskStats } from '@/types/task'
import { CheckCircle, Clock, AlertCircle, BookOpen, Calendar, TrendingUp } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (user?.section_id) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load tasks for user's section
      const tasksData = await getTasks({
        filters: { section_id: user?.section_id },
        sort_by: 'due_date',
        sort_order: 'asc',
        limit: 10
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

      // Load stats
      const statsData = await getTaskStats(user?.section_id, supabase)
      setStats(statsData)

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data')
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

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <Button onClick={loadDashboardData}>Try again</Button>
        </div>
      </div>
    )
  }

  const pendingTasks = tasks.filter(task => !task.user_task || task.user_task.status === 'pending')
  const completedTasks = tasks.filter(task => task.user_task?.status === 'completed')
  const overdueTasks = tasks.filter(task => task.status === 'overdue' && (!task.user_task || task.user_task.status === 'pending'))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Welcome back, {user?.name}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {user?.section?.name} • {user?.batch?.name} • {user?.department?.name}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {completedTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pendingTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {overdueTasks.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completion Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks
            </h3>
            <Button variant="outline" size="sm">
              View All Tasks
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your section admin hasn't assigned any tasks yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" fullWidth>
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button variant="outline" fullWidth>
              <CheckCircle className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
            <Button variant="outline" fullWidth>
              <BookOpen className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
