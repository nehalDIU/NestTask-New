import { Database } from './database'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type UserTaskStatus = 'pending' | 'completed'

export type Task = Database['public']['Tables']['tasks']['Row']
export type UserTask = Database['public']['Tables']['user_tasks']['Row']

export type TaskWithDetails = Task & {
  created_by_user: {
    id: string
    name: string
    email: string
  }
  section: {
    id: string
    name: string
    batch: {
      id: string
      name: string
      department: {
        id: string
        name: string
      }
    }
  }
  user_task?: UserTask
  completion_count?: number
  total_users?: number
}

export type CreateTaskData = {
  title: string
  description?: string
  due_date?: string
  category?: string
  section_id: string
  files?: FileUpload[]
}

export type UpdateTaskData = Partial<CreateTaskData> & {
  id: string
  status?: TaskStatus
}

export type FileUpload = {
  name: string
  url: string
  size: number
  type: string
}

export type TaskFilters = {
  status?: TaskStatus[]
  category?: string[]
  due_date_from?: string
  due_date_to?: string
  search?: string
  section_id?: string
  created_by?: string
}

export type TaskSortBy = 'created_at' | 'due_date' | 'title' | 'status' | 'updated_at'
export type SortOrder = 'asc' | 'desc'

export type TaskQueryOptions = {
  filters?: TaskFilters
  sort_by?: TaskSortBy
  sort_order?: SortOrder
  page?: number
  limit?: number
}

export type TaskStats = {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
  completion_rate: number
}

export type UserTaskProgress = {
  user_id: string
  user_name: string
  user_email: string
  total_tasks: number
  completed_tasks: number
  completion_rate: number
  last_activity: string
}
