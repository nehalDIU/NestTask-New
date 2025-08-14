'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { createClient } from '@/lib/supabase'
import { 
  Users, 
  Building, 
  FileText, 
  TrendingUp, 
  Shield, 
  AlertCircle,
  UserPlus,
  Settings,
  BarChart3,
  Database
} from 'lucide-react'

interface SystemStats {
  totalUsers: number
  totalTasks: number
  totalDepartments: number
  totalSections: number
  usersByRole: { role: string; count: number }[]
  tasksByStatus: { status: string; count: number }[]
  recentActivity: any[]
}

export default function SuperAdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    loadSystemStats()
  }, [])

  const loadSystemStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load system-wide statistics
      const [
        { count: totalUsers },
        { count: totalTasks },
        { count: totalDepartments },
        { count: totalSections },
        { data: usersByRole },
        { data: tasksByStatus }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('sections').select('*', { count: 'exact', head: true }),
        supabase
          .from('users')
          .select('role')
          .then(({ data }) => {
            const roleCounts = data?.reduce((acc: any, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1
              return acc
            }, {})
            return { 
              data: Object.entries(roleCounts || {}).map(([role, count]) => ({ role, count }))
            }
          }),
        supabase
          .from('tasks')
          .select('status')
          .then(({ data }) => {
            const statusCounts = data?.reduce((acc: any, task) => {
              acc[task.status] = (acc[task.status] || 0) + 1
              return acc
            }, {})
            return { 
              data: Object.entries(statusCounts || {}).map(([status, count]) => ({ status, count }))
            }
          })
      ])

      setStats({
        totalUsers: totalUsers || 0,
        totalTasks: totalTasks || 0,
        totalDepartments: totalDepartments || 0,
        totalSections: totalSections || 0,
        usersByRole: usersByRole || [],
        tasksByStatus: tasksByStatus || [],
        recentActivity: []
      })

    } catch (err) {
      console.error('Error loading system stats:', err)
      setError('Failed to load system statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading super admin dashboard..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <Button onClick={loadSystemStats}>Try again</Button>
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
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Super Admin Dashboard
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    System-wide Management & Analytics
                  </dd>
                </dl>
              </div>
            </div>
            <Button leftIcon={<UserPlus className="h-4 w-4" />}>
              Manage Users
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview Stats */}
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
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalUsers || 0}
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
                    {stats?.totalTasks || 0}
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
                <Building className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Departments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalDepartments || 0}
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
                <Database className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sections
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalSections || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users by Role */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Users by Role
          </h3>
          <AnalyticsChart 
            data={stats?.usersByRole.map(item => ({
              name: item.role.replace('_', ' ').toUpperCase(),
              value: item.count,
              color: item.role === 'super_admin' ? '#8b5cf6' : 
                     item.role === 'section_admin' ? '#3b82f6' : '#10b981'
            })) || []}
          />
        </div>

        {/* Tasks by Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Tasks by Status
          </h3>
          <AnalyticsChart 
            data={stats?.tasksByStatus.map(item => ({
              name: item.status.replace('_', ' ').toUpperCase(),
              value: item.count,
              color: item.status === 'completed' ? '#10b981' :
                     item.status === 'in_progress' ? '#3b82f6' :
                     item.status === 'overdue' ? '#ef4444' : '#fbbf24'
            })) || []}
            type="bar"
          />
        </div>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            User Management
          </h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth leftIcon={<Users className="h-4 w-4" />}>
              View All Users
            </Button>
            <Button variant="outline" fullWidth leftIcon={<UserPlus className="h-4 w-4" />}>
              Add New User
            </Button>
            <Button variant="outline" fullWidth leftIcon={<Shield className="h-4 w-4" />}>
              Manage Roles
            </Button>
          </div>
        </div>

        {/* System Management */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            System Management
          </h3>
          <div className="space-y-3">
            <Button variant="outline" fullWidth leftIcon={<Building className="h-4 w-4" />}>
              Manage Departments
            </Button>
            <Button variant="outline" fullWidth leftIcon={<BarChart3 className="h-4 w-4" />}>
              System Analytics
            </Button>
            <Button variant="outline" fullWidth leftIcon={<Settings className="h-4 w-4" />}>
              System Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent System Activity
          </h3>
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Activity Monitoring</h3>
            <p className="mt-1 text-sm text-gray-500">
              System activity monitoring will be displayed here.
            </p>
          </div>
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
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
            <Button variant="outline" fullWidth>
              <Building className="mr-2 h-4 w-4" />
              Department Setup
            </Button>
            <Button variant="outline" fullWidth>
              <BarChart3 className="mr-2 h-4 w-4" />
              System Reports
            </Button>
            <Button variant="outline" fullWidth>
              <Settings className="mr-2 h-4 w-4" />
              System Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
