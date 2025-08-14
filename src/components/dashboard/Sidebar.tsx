'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { NAVIGATION } from '@/lib/constants'
import { BookOpen, Home, CheckSquare, Calendar, User, Users, Plus, BarChart3, Building, Settings } from 'lucide-react'
import { clsx } from 'clsx'

const iconMap = {
  Home,
  CheckSquare,
  Calendar,
  User,
  Users,
  Plus,
  BarChart3,
  Building,
  Settings,
}

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const navigation = NAVIGATION[user.role] || []

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">NestTask</span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        {/* User info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.name}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
