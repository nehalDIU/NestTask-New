'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { TaskCard } from '@/components/dashboard/TaskCard'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { getTasks, getTaskStats, getUsersBySection, getUserTaskProgress } from '@/lib/fetchers'
import { createClient } from '@/lib/supabase'
import { TaskWithDetails, TaskStats, UserTaskProgress } from '@/types/task'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  BarChart3, 
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react'

export default function SectionAdminDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<UserTaskProgress[]>([])
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

      // Load tasks created by this admin
      const tasksData = await getTasks({
        filters: { 
          section_id: user?.section_id,
          created_by: user?.id 
        },
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: 5
      }, supabase)

      setTasks(tasksData)

      // Load section stats
      const statsData = await getTaskStats(user?.section_id, supabase)
      setStats(statsData)

      // Load students in section
      const studentsData = await getUsersBySection(user?.section_id || '', supabase)
      setStudents(studentsData.filter(s => s.role === 'user'))

      // Load user progress
      const progressData = await getUserTaskProgress(user?.section_id || '', supabase)
      setUserProgress(progressData)

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading section admin dashboard..." />
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Section Admin Dashboard
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {user?.section?.name} • {user?.batch?.name} • {user?.department?.name}
                  </dd>
                </dl>
              </div>
            </div>
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {students.length}
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
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.total || 0}
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
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Tasks
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.completed || 0}
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
                    {Math.round(stats?.completion_rate || 0)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Task Status Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Task Status Overview
          </h3>
          <AnalyticsChart 
            data={[
              { name: 'Pending', value: stats?.pending || 0, color: '#fbbf24' },
              { name: 'In Progress', value: stats?.in_progress || 0, color: '#3b82f6' },
              { name: 'Completed', value: stats?.completed || 0, color: '#10b981' },
              { name: 'Overdue', value: stats?.overdue || 0, color: '#ef4444' },
            ]}
          />
        </div>

        {/* Student Progress */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Top Performing Students
          </h3>
          <div className="space-y-3">
            {userProgress
              .sort((a, b) => b.completion_rate - a.completion_rate)
              .slice(0, 5)
              .map((student, index) => (
                <div key={student.user_id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {student.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {student.user_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student.completed_tasks}/{student.total_tasks} tasks
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round(student.completion_rate)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks Created
            </h3>
            <Button variant="outline" size="sm">
              View All Tasks
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks created yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by creating your first task for the section.
              </p>
              <div className="mt-6">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create Task
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showActions={false}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" fullWidth>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
            <Button variant="outline" fullWidth>
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
            <Button variant="outline" fullWidth>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" fullWidth>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
