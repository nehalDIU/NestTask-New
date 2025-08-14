import React from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const spinner = (
    <div className={clsx('flex items-center justify-center', className)}>
      <Loader2 className={clsx('animate-spin text-primary-600', sizeClasses[size])} />
      {text && (
        <span className="ml-2 text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <Loader2 className={clsx('animate-spin text-primary-600 mx-auto', sizeClasses[size])} />
          {text && (
            <p className="mt-2 text-sm text-gray-600">
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  return spinner
}

export { LoadingSpinner }
