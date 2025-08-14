import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up - NestTask',
  description: 'Create your NestTask account to manage university tasks',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join NestTask to manage your university tasks
        </p>
      </div>
      
      <SignupForm />
    </div>
  )
}
