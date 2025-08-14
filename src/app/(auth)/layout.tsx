import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center">
          <BookOpen className="h-12 w-12 text-primary-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">NestTask</span>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          University Task Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 NestTask. Built for Daffodil International University.
        </p>
      </div>
    </div>
  )
}
