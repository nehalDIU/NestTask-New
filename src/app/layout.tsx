import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NestTask - University Task Management',
  description: 'A comprehensive task management system for university students and administrators',
  keywords: ['university', 'task management', 'students', 'education', 'DIU'],
  authors: [{ name: 'NestTask Team' }],
  creator: 'NestTask',
  publisher: 'NestTask',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'NestTask - University Task Management',
    description: 'A comprehensive task management system for university students and administrators',
    url: '/',
    siteName: 'NestTask',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NestTask - University Task Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NestTask - University Task Management',
    description: 'A comprehensive task management system for university students and administrators',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
