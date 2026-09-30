import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Air Detective',
  description:
    'Play Air Detective - read a year of real hourly air-pollution data for your own ZIP code and work out what moved the air: smoke, heat and sunlight, a winter inversion, or nothing at all. Free forensics game for students.',
  alternates: { canonical: '/games/air-detective/' },
  openGraph: {
    title: 'Air Detective - EcoQuest Foundation',
    description:
      'A forensics game over real hourly air-quality data for your own ZIP. Learn why PM2.5 and ozone are different pollutants with different causes - and when the honest answer is "not enough evidence".',
  },
}

export default function AirDetectiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
