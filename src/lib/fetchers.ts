import { createClient, createServerSupabaseClient } from './supabase'
import { Database } from '@/types/database'
import { TaskWithDetails, TaskQueryOptions, UserTaskProgress } from '@/types/task'

type SupabaseClient = ReturnType<typeof createClient>

// Department fetchers
export async function getDepartments(supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('departments')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

// Batch fetchers
export async function getBatchesByDepartment(departmentId: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('batches')
    .select('*')
    .eq('department_id', departmentId)
    .order('name')

  if (error) throw error
  return data
}

// Section fetchers
export async function getSectionsByBatch(batchId: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('sections')
    .select('*')
    .eq('batch_id', batchId)
    .order('name')

  if (error) throw error
  return data
}

// User fetchers
export async function getUserProfile(userId: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('users')
    .select(`
      *,
      department:departments(*),
      batch:batches(*),
      section:sections(*)
    `)
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getUsersBySection(sectionId: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('section_id', sectionId)
    .order('name')

  if (error) throw error
  return data
}

// Task fetchers
export async function getTasks(options: TaskQueryOptions = {}, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  let query = client
    .from('tasks')
    .select(`
      *,
      created_by_user:users!tasks_created_by_fkey(id, name, email),
      section:sections(
        id,
        name,
        batch:batches(
          id,
          name,
          department:departments(id, name)
        )
      )
    `)

  // Apply filters
  if (options.filters) {
    const { filters } = options
    
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status)
    }
    
    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category)
    }
    
    if (filters.section_id) {
      query = query.eq('section_id', filters.section_id)
    }
    
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by)
    }
    
    if (filters.due_date_from) {
      query = query.gte('due_date', filters.due_date_from)
    }
    
    if (filters.due_date_to) {
      query = query.lte('due_date', filters.due_date_to)
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
  }

  // Apply sorting
  const sortBy = options.sort_by || 'created_at'
  const sortOrder = options.sort_order || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  // Apply pagination
  if (options.page && options.limit) {
    const from = (options.page - 1) * options.limit
    const to = from + options.limit - 1
    query = query.range(from, to)
  }

  const { data, error } = await query

  if (error) throw error
  return data as TaskWithDetails[]
}

export async function getTaskById(taskId: string, userId?: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  let query = client
    .from('tasks')
    .select(`
      *,
      created_by_user:users!tasks_created_by_fkey(id, name, email),
      section:sections(
        id,
        name,
        batch:batches(
          id,
          name,
          department:departments(id, name)
        )
      )
    `)
    .eq('id', taskId)
    .single()

  const { data: task, error } = await query

  if (error) throw error

  // Get user's completion status if userId provided
  if (userId) {
    const { data: userTask } = await client
      .from('user_tasks')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single()

    return { ...task, user_task: userTask } as TaskWithDetails
  }

  return task as TaskWithDetails
}

// Task statistics
export async function getTaskStats(sectionId?: string, supabase?: SupabaseClient) {
  const client = supabase || createClient()
  
  let query = client
    .from('tasks')
    .select('status')

  if (sectionId) {
    query = query.eq('section_id', sectionId)
  }

  const { data, error } = await query

  if (error) throw error

  const stats = {
    total: data.length,
    pending: data.filter(t => t.status === 'pending').length,
    in_progress: data.filter(t => t.status === 'in_progress').length,
    completed: data.filter(t => t.status === 'completed').length,
    overdue: data.filter(t => t.status === 'overdue').length,
    completion_rate: 0
  }

  stats.completion_rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return stats
}

// User task progress
export async function getUserTaskProgress(sectionId: string, supabase?: SupabaseClient): Promise<UserTaskProgress[]> {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('users')
    .select(`
      id,
      name,
      email,
      user_tasks(
        status,
        completed_at,
        task:tasks(section_id)
      )
    `)
    .eq('section_id', sectionId)

  if (error) throw error

  return data.map(user => {
    const userTasks = user.user_tasks.filter(ut => ut.task?.section_id === sectionId)
    const completedTasks = userTasks.filter(ut => ut.status === 'completed')
    
    return {
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      total_tasks: userTasks.length,
      completed_tasks: completedTasks.length,
      completion_rate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
      last_activity: completedTasks.length > 0 
        ? Math.max(...completedTasks.map(t => new Date(t.completed_at || '').getTime())).toString()
        : ''
    }
  })
}
