import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SITE_URL = 'https://www.ecoquestfoundation.org'
const SITE_NAME = 'EcoQuest Foundation'
const SITE_DESCRIPTION =
  'Student-led nonprofit empowering youth to protect the planet through interactive educational games, web apps, and community conservation events.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EcoQuest Foundation - Empowering Youth to Protect Our Planet',
    template: '%s | EcoQuest Foundation',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'environmental education',
    'conservation',
    'youth programs',
    'EcoQuest Foundation',
    'sustainability',
    'student nonprofit',
    'environmental games',
    'ecology for kids',
    'K-12 environmental education',
    'community cleanups',
    'youth conservation',
    'STEM education',
    'climate education',
    'interactive learning',
    'ocean conservation',
    'wildlife protection',
  ],
  authors: [{ name: 'EcoQuest Foundation', url: SITE_URL }],
  creator: 'EcoQuest Foundation',
  publisher: 'EcoQuest Foundation',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'EcoQuest Foundation - Empowering Youth to Protect Our Planet',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'EcoQuest Foundation Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoQuest Foundation - Empowering Youth to Protect Our Planet',
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
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
  alternates: {
    canonical: SITE_URL,
  },
}

function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NonprofitOrganization',
    name: SITE_NAME,
    legalName: 'ECOQUEST FOUNDATION',
    alternateName: 'EcoQuest Foundation',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
    foundingDate: '2024-08-20',
    taxID: '33-4376241',
    naics: '813312',
    nonprofitStatus: 'Nonprofit501c3',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    email: 'ecoquestfoundation@gmail.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiry',
      email: 'ecoquestfoundation@gmail.com',
      url: `${SITE_URL}/contact/`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Environmental Education',
      'Conservation',
      'Youth Programs',
      'Interactive Learning Games',
      'Community Cleanups',
      'STEM Education',
      'Climate Awareness',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="font-sans" style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
