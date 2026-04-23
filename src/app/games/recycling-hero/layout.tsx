import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recycling Hero',
  description: 'Play Recycling Hero - sort waste into the correct bins and become a recycling champion. Interactive environmental game teaching proper waste management for students.',
  alternates: { canonical: '/games/recycling-hero/' },
  openGraph: {
    title: 'Recycling Hero - EcoQuest Foundation',
    description: 'Interactive waste sorting game teaching proper recycling and waste management for students.',
  },
}

export default function RecyclingHeroLayout({ children }: { children: React.ReactNode }) {
  return children
}
