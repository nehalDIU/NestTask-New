import { z } from 'zod'
import { TASK_CATEGORIES, TASK_STATUS, USER_ROLES, USER_TASK_STATUS } from './constants'

// Auth validation schemas
export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(
      (email) => email.endsWith('@diu.edu.bd'),
      'Please use your @diu.edu.bd email address'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be less than 100 characters'),
  student_id: z
    .string()
    .optional()
    .refine(
      (id) => !id || /^\d{2}-\d{5}-\d$/.test(id),
      'Student ID must be in format: XX-XXXXX-X'
    ),
  department_id: z.string().uuid('Please select a department'),
  batch_id: z.string().uuid('Please select a batch'),
  section_id: z.string().uuid('Please select a section'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(
      (email) => email.endsWith('@diu.edu.bd'),
      'Please use your @diu.edu.bd email address'
    ),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(
      (email) => email.endsWith('@diu.edu.bd'),
      'Please use your @diu.edu.bd email address'
    ),
})

// Task validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  due_date: z
    .string()
    .datetime('Invalid date format')
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Due date must be in the future'
    ),
  category: z
    .enum(TASK_CATEGORIES)
    .default('general'),
  section_id: z.string().uuid('Invalid section'),
  files: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        size: z.number().positive(),
        type: z.string(),
      })
    )
    .max(5, 'Maximum 5 files allowed')
    .optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid('Invalid task ID'),
  status: z.enum(Object.values(TASK_STATUS) as [string, ...string[]]).optional(),
})

export const taskFiltersSchema = z.object({
  status: z.array(z.enum(Object.values(TASK_STATUS) as [string, ...string[]])).optional(),
  category: z.array(z.enum(TASK_CATEGORIES)).optional(),
  due_date_from: z.string().datetime().optional(),
  due_date_to: z.string().datetime().optional(),
  search: z.string().max(100).optional(),
  section_id: z.string().uuid().optional(),
  created_by: z.string().uuid().optional(),
})

export const taskQuerySchema = z.object({
  filters: taskFiltersSchema.optional(),
  sort_by: z.enum(['created_at', 'due_date', 'title', 'status', 'updated_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// User validation schemas
export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be less than 100 characters'),
  student_id: z
    .string()
    .optional()
    .refine(
      (id) => !id || /^\d{2}-\d{5}-\d$/.test(id),
      'Student ID must be in format: XX-XXXXX-X'
    ),
})

export const updateUserRoleSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role: z.enum(Object.values(USER_ROLES) as [string, ...string[]]),
})

// User task validation schemas
export const updateUserTaskSchema = z.object({
  task_id: z.string().uuid('Invalid task ID'),
  status: z.enum(Object.values(USER_TASK_STATUS) as [string, ...string[]]),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB
      'File size must be less than 10MB'
    )
    .refine(
      (file) => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
      ].includes(file.type),
      'File type not supported'
    ),
})

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['tasks', 'users', 'all']).default('all'),
})

// Department/Batch/Section validation
export const departmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name must be less than 100 characters'),
})

export const batchSchema = z.object({
  name: z
    .string()
    .min(2, 'Batch name must be at least 2 characters')
    .max(50, 'Batch name must be less than 50 characters'),
  department_id: z.string().uuid('Invalid department'),
})

export const sectionSchema = z.object({
  name: z
    .string()
    .min(2, 'Section name must be at least 2 characters')
    .max(20, 'Section name must be less than 20 characters'),
  batch_id: z.string().uuid('Invalid batch'),
})

// Type exports for use in components
export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type CreateTaskData = z.infer<typeof createTaskSchema>
export type UpdateTaskData = z.infer<typeof updateTaskSchema>
export type TaskFilters = z.infer<typeof taskFiltersSchema>
export type TaskQueryOptions = z.infer<typeof taskQuerySchema>
export type UpdateUserProfileData = z.infer<typeof updateUserProfileSchema>
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>
export type UpdateUserTaskData = z.infer<typeof updateUserTaskSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
export type PaginationData = z.infer<typeof paginationSchema>
export type SearchData = z.infer<typeof searchSchema>
export type DepartmentData = z.infer<typeof departmentSchema>
export type BatchData = z.infer<typeof batchSchema>
export type SectionData = z.infer<typeof sectionSchema>
