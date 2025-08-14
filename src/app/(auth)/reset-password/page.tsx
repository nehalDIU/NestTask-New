import { Metadata } from 'next'
import { PasswordResetForm } from '@/components/auth/PasswordResetForm'

export const metadata: Metadata = {
  title: 'Reset Password - NestTask',
  description: 'Reset your NestTask account password',
}

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a reset link
        </p>
      </div>
      
      <PasswordResetForm />
    </div>
  )
}
