import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Environmental education resources from EcoQuest Foundation. Access educational materials, interactive apps, guides from NASA, National Geographic, EPA, and NOAA for students and educators.',
  alternates: { canonical: '/resources/' },
  openGraph: {
    title: 'Resources - EcoQuest Foundation',
    description: 'Environmental education resources, interactive apps, and guides for students and educators.',
    images: ogImage('resources', 'EcoQuest Foundation resources'),
  },
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children
}
