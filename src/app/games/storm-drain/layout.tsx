import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Storm Drain Detective',
  description:
    'Trace where the water on your street actually goes. Storm Drain Detective follows the real USGS river network downstream from your ZIP code, names the gauges it passes, and shows where it ends up.',
  alternates: { canonical: '/games/storm-drain/' },
  openGraph: {
    title: 'Storm Drain Detective - EcoQuest Foundation',
    description:
      'Predict where your street’s water goes, then watch the real USGS downstream trace draw itself. Free K-12 environmental education from EcoQuest Foundation.',
  },
}

export default function StormDrainLayout({ children }: { children: React.ReactNode }) {
  return children
}
