'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { TaskWithDetails, TaskQueryOptions } from '@/types/task'
import { getTasks } from '@/lib/fetchers'

export function useTasks(options: TaskQueryOptions = {}) {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTasks(options, supabase)
      setTasks(data)
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: options.filters?.section_id ? `section_id=eq.${options.filters.section_id}` : undefined
        },
        (payload) => {
          console.log('Task change received:', payload)
          // Reload tasks when changes occur
          loadTasks()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_tasks'
        },
        (payload) => {
          console.log('User task change received:', payload)
          // Reload tasks when user task status changes
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadTasks, options.filters?.section_id])

  const createTask = useCallback(async (taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) throw error

      // Task will be automatically updated via real-time subscription
      return { success: true, data }
    } catch (err: any) {
      console.error('Error creating task:', err)
      return { success: false, error: err.message }
    }
  }, [supabase])

  const updateTask = useCallback(async (taskId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error

      // Task will be automatically updated via real-time subscription
      return { success: true, data }
    } catch (err: any) {
      console.error('Error updating task:', err)
      return { success: false, error: err.message }
    }
  }, [supabase])

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      // Task will be automatically removed via real-time subscription
      return { success: true }
    } catch (err: any) {
      console.error('Error deleting task:', err)
      return { success: false, error: err.message }
    }
  }, [supabase])

  const completeTask = useCallback(async (taskId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .upsert({
          user_id: userId,
          task_id: taskId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      // User task will be automatically updated via real-time subscription
      return { success: true }
    } catch (err: any) {
      console.error('Error completing task:', err)
      return { success: false, error: err.message }
    }
  }, [supabase])

  return {
    tasks,
    loading,
    error,
    refetch: loadTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask
  }
}
