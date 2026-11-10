import type { Metadata } from 'next'
import { ogImage } from '@/lib/og'

export const metadata: Metadata = {
  title: 'Backyard Bioblitz',
  description:
    'Play Backyard Bioblitz - identify the wildlife and plants actually recorded near your ZIP code, using real research-grade photos and observation counts from iNaturalist.',
  alternates: { canonical: '/games/bioblitz/' },
  openGraph: {
    title: 'Backyard Bioblitz - EcoQuest Foundation',
    description:
      'Real photos of species genuinely observed near you. Learn to identify your neighbors, then go find them.',
    images: ogImage('game-bioblitz', 'Backyard Bioblitz, a free EcoQuest game'),
  },
}

export default function BioblitzLayout({ children }: { children: React.ReactNode }) {
  return children
}
