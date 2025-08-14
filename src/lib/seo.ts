import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description = 'A comprehensive task management system for university students and administrators at Daffodil International University',
  keywords = ['university', 'task management', 'students', 'education', 'DIU'],
  image = '/og-image.png',
  url,
  type = 'website',
  noIndex = false
}: SEOProps = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const fullTitle = title ? `${title} - NestTask` : 'NestTask - University Task Management'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: 'NestTask Team' }],
    creator: 'NestTask',
    publisher: 'NestTask',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'NestTask',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStructuredData(type: 'organization' | 'website' | 'article', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NestTask',
        description: 'University Task Management System for Daffodil International University',
        url: baseUrl,
        logo: `${baseUrl}/logo.svg`,
        sameAs: [],
        ...data
      }

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NestTask',
        description: 'University Task Management System',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        ...data
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        publisher: {
          '@type': 'Organization',
          name: 'NestTask',
          logo: `${baseUrl}/logo.svg`
        },
        ...data
      }

    default:
      return null
  }
}
