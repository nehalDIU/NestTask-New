'use client'

import { useAuth } from './useAuth'
import { USER_ROLES } from '@/lib/constants'

export function useRole() {
  const { user } = useAuth()

  const isStudent = user?.role === USER_ROLES.USER
  const isSectionAdmin = user?.role === USER_ROLES.SECTION_ADMIN
  const isSuperAdmin = user?.role === USER_ROLES.SUPER_ADMIN
  const isAdmin = isSectionAdmin || isSuperAdmin

  const hasPermission = (requiredRole: string | string[]) => {
    if (!user) return false
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    return roles.includes(user.role)
  }

  const canCreateTasks = isAdmin
  const canEditTasks = isAdmin
  const canDeleteTasks = isAdmin
  const canManageUsers = isSuperAdmin || isSectionAdmin
  const canManageSystem = isSuperAdmin

  return {
    user,
    role: user?.role,
    isStudent,
    isSectionAdmin,
    isSuperAdmin,
    isAdmin,
    hasPermission,
    canCreateTasks,
    canEditTasks,
    canDeleteTasks,
    canManageUsers,
    canManageSystem
  }
}
