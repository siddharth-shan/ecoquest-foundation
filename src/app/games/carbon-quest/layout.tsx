import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Footprint Quest',
  description: 'Play Carbon Footprint Quest - make daily choices to reduce your carbon impact and learn about climate change. Interactive environmental education game for students.',
  alternates: { canonical: '/games/carbon-quest/' },
  openGraph: {
    title: 'Carbon Footprint Quest - EcoQuest Foundation',
    description: 'Make daily choices to reduce carbon impact. Interactive climate education game for students.',
  },
}

export default function CarbonQuestLayout({ children }: { children: React.ReactNode }) {
  return children
}
