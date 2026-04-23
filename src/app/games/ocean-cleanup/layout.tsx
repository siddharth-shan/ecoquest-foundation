import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ocean Cleanup Challenge',
  description: 'Play the Ocean Cleanup Challenge - a timed game where you clean ocean trash and learn about marine pollution. Fun environmental education for K-12 students.',
  alternates: { canonical: '/games/ocean-cleanup/' },
  openGraph: {
    title: 'Ocean Cleanup Challenge - EcoQuest Foundation',
    description: 'Timed ocean cleanup game teaching about marine pollution. Fun environmental education for K-12 students.',
  },
}

export default function OceanCleanupLayout({ children }: { children: React.ReactNode }) {
  return children
}
