import { Database } from './database'

export type UserRole = 'user' | 'section_admin' | 'super_admin'

export type User = Database['public']['Tables']['users']['Row']

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
  student_id?: string
  department_id?: string
  batch_id?: string
  section_id?: string
  department?: {
    id: string
    name: string
  }
  batch?: {
    id: string
    name: string
  }
  section?: {
    id: string
    name: string
  }
}

export type SignupFormData = {
  email: string
  password: string
  confirmPassword: string
  name: string
  student_id?: string
  department_id: string
  batch_id: string
  section_id: string
}

export type LoginFormData = {
  email: string
  password: string
  remember?: boolean
}

export type ResetPasswordFormData = {
  email: string
}

export type AuthState = {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

export type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signUp: (data: SignupFormData) => Promise<{ success: boolean; error?: string }>
  signIn: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  refreshUser: () => Promise<void>
}
