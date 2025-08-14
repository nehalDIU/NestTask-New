// User roles
export const USER_ROLES = {
  USER: 'user',
  SECTION_ADMIN: 'section_admin',
  SUPER_ADMIN: 'super_admin',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Task statuses
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]

// User task statuses
export const USER_TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const

export type UserTaskStatus = typeof USER_TASK_STATUS[keyof typeof USER_TASK_STATUS]

// Task categories
export const TASK_CATEGORIES = [
  'assignment',
  'project',
  'exam',
  'presentation',
  'lab',
  'quiz',
  'homework',
  'research',
  'general',
] as const

export type TaskCategory = typeof TASK_CATEGORIES[number]

// Navigation items for different roles
export const NAVIGATION = {
  [USER_ROLES.USER]: [
    { name: 'Dashboard', href: '/student', icon: 'Home' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Calendar', href: '/student/calendar', icon: 'Calendar' },
    { name: 'Profile', href: '/student/profile', icon: 'User' },
  ],
  [USER_ROLES.SECTION_ADMIN]: [
    { name: 'Dashboard', href: '/section-admin', icon: 'Home' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Create Task', href: '/tasks/create', icon: 'Plus' },
    { name: 'Students', href: '/section-admin/students', icon: 'Users' },
    { name: 'Analytics', href: '/section-admin/analytics', icon: 'BarChart3' },
    { name: 'Profile', href: '/section-admin/profile', icon: 'User' },
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    { name: 'Dashboard', href: '/super-admin', icon: 'Home' },
    { name: 'Users', href: '/super-admin/users', icon: 'Users' },
    { name: 'Departments', href: '/super-admin/departments', icon: 'Building' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Analytics', href: '/super-admin/analytics', icon: 'BarChart3' },
    { name: 'Settings', href: '/super-admin/settings', icon: 'Settings' },
  ],
} as const

// Status colors for UI
export const STATUS_COLORS = {
  [TASK_STATUS.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  [TASK_STATUS.COMPLETED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-400',
  },
  [TASK_STATUS.OVERDUE]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
} as const

// Role colors for UI
export const ROLE_COLORS = {
  [USER_ROLES.USER]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
  },
  [USER_ROLES.SECTION_ADMIN]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  [USER_ROLES.SUPER_ADMIN]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
  },
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const

// File upload
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
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
  ],
  MAX_FILES: 5,
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  TASKS: {
    CREATE: '/api/tasks/create',
    UPDATE: '/api/tasks/update',
    DELETE: '/api/tasks/delete',
  },
  USERS: {
    UPDATE_ROLE: '/api/users/update-role',
    DELETE: '/api/users/delete',
  },
} as const

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  EMAIL_DOMAIN: 'Please use your @diu.edu.bd email address.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  TASK_COMPLETED: 'Task marked as completed!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
} as const
