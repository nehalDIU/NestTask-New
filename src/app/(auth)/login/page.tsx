import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - NestTask',
  description: 'Sign in to your NestTask account',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to NestTask
        </p>
      </div>
      
      <LoginForm />
    </div>
  )
}
