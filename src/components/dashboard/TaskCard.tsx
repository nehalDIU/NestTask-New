'use client'

import React from 'react'
import { TaskWithDetails } from '@/types/task'
import { STATUS_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Calendar, User, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { clsx } from 'clsx'

interface TaskCardProps {
  task: TaskWithDetails
  onComplete?: (taskId: string) => void
  onView?: (taskId: string) => void
  showActions?: boolean
  compact?: boolean
}

export function TaskCard({ 
  task, 
  onComplete, 
  onView, 
  showActions = true, 
  compact = false 
}: TaskCardProps) {
  const statusColors = STATUS_COLORS[task.status]
  const isCompleted = task.user_task?.status === 'completed'
  const isOverdue = task.status === 'overdue'
  const dueDate = task.due_date ? new Date(task.due_date) : null
  const isUpcoming = dueDate && dueDate > new Date() && dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const handleComplete = () => {
    if (onComplete && !isCompleted) {
      onComplete(task.id)
    }
  }

  const handleView = () => {
    if (onView) {
      onView(task.id)
    }
  }

  return (
    <div className={clsx(
      'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
      compact ? 'p-4' : 'p-6'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              statusColors.bg,
              statusColors.text
            )}>
              <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', statusColors.dot)} />
              {task.status.replace('_', ' ')}
            </span>
            
            {isOverdue && (
              <span className="inline-flex items-center text-red-600">
                <AlertCircle className="h-4 w-4" />
              </span>
            )}
            
            {isUpcoming && (
              <span className="inline-flex items-center text-yellow-600">
                <Clock className="h-4 w-4" />
              </span>
            )}
            
            {isCompleted && (
              <span className="inline-flex items-center text-green-600">
                <CheckCircle className="h-4 w-4" />
              </span>
            )}
          </div>
          
          <h3 className={clsx(
            'font-medium text-gray-900 truncate',
            compact ? 'text-sm' : 'text-base'
          )}>
            {task.title}
          </h3>
          
          {!compact && task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            {!isCompleted && (
              <Button
                size="sm"
                variant="success"
                onClick={handleComplete}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Complete
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleView}
            >
              View
            </Button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className={clsx(
        'flex items-center space-x-4 text-sm text-gray-500',
        compact ? 'mt-2' : 'mt-4'
      )}>
        {dueDate && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span className={clsx(
              isOverdue && 'text-red-600 font-medium',
              isUpcoming && 'text-yellow-600 font-medium'
            )}>
              Due {format(dueDate, 'MMM dd, yyyy')}
            </span>
          </div>
        )}
        
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span>{task.created_by_user.name}</span>
        </div>
        
        {task.category && (
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span className="capitalize">{task.category}</span>
          </div>
        )}
      </div>

      {/* Section info */}
      {!compact && (
        <div className="mt-3 text-xs text-gray-400">
          {task.section.batch.department.name} • {task.section.batch.name} • {task.section.name}
        </div>
      )}

      {/* Files */}
      {!compact && task.files && Array.isArray(task.files) && task.files.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            <span>{task.files.length} file(s) attached</span>
          </div>
        </div>
      )}

      {/* Progress indicator for completed tasks */}
      {isCompleted && (
        <div className="mt-3 text-xs text-green-600 font-medium">
          ✓ Completed {task.user_task?.completed_at && format(new Date(task.user_task.completed_at), 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  )
}
