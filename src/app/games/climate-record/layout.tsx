import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Climate Record',
  description:
    'Predict how your own town has changed since the 1950s, then meet the real 75-year daily temperature record for your ZIP code. Scored on calibration, not doom.',
  alternates: { canonical: '/games/climate-record/' },
  openGraph: {
    title: 'Your Climate Record - EcoQuest Foundation',
    description:
      'Commit to a prediction about your town, then check it against 75 years of real daily temperature data. An environmental education game about signal, noise, and local action.',
  },
}

export default function ClimateRecordLayout({ children }: { children: React.ReactNode }) {
  return children
}
