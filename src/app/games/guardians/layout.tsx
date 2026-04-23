import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guardians of the Green',
  description: 'Play Guardians of the Green - an interactive ecosystem management game where you protect forests, oceans, wetlands, and more. Learn about conservation through hands-on gameplay.',
  alternates: { canonical: '/games/guardians/' },
  openGraph: {
    title: 'Guardians of the Green - EcoQuest Foundation',
    description: 'Interactive ecosystem management game. Protect forests, oceans, and wetlands while learning conservation.',
  },
}

export default function GuardiansLayout({ children }: { children: React.ReactNode }) {
  return children
}
