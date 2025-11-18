'use client'

import { useState, useEffect } from 'react'

interface ImpactMetric {
  icon: string
  value: number
  label: string
  suffix: string
  color: string
  description: string
}

export default function ImpactDashboard() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([
    {
      icon: '🎓',
      value: 0,
      label: 'Students Reached',
      suffix: '+',
      color: 'from-blue-500 to-cyan-600',
      description: 'Through our educational programs and games',
    },
    {
      icon: '🏫',
      value: 0,
      label: 'Schools Partnered',
      suffix: '',
      color: 'from-green-500 to-emerald-600',
      description: 'Active partnerships across California',
    },
    {
      icon: '🏖️',
      value: 0,
      label: 'Beach Cleanups',
      suffix: '',
      color: 'from-yellow-500 to-orange-600',
      description: 'Community conservation events completed',
    },
    {
      icon: '♻️',
      value: 0,
      label: 'Pounds Collected',
      suffix: '+',
      color: 'from-purple-500 to-indigo-600',
      description: 'Trash and recyclables removed from nature',
    },
    {
      icon: '🌳',
      value: 0,
      label: 'Trees Planted',
      suffix: '+',
      color: 'from-green-600 to-teal-600',
      description: 'Native trees planted for reforestation',
    },
    {
      icon: '🎮',
      value: 0,
      label: 'Game Sessions',
      suffix: '+',
      color: 'from-indigo-500 to-purple-600',
      description: 'Interactive learning experiences completed',
    },
  ])

  const targetValues = [500, 15, 12, 2500, 150, 3200]

  useEffect(() => {
    // Animate numbers on mount
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setMetrics((prev) =>
        prev.map((metric, index) => ({
          ...metric,
          value: Math.floor(targetValues[index] * progress),
        }))
      )

      if (currentStep >= steps) {
        clearInterval(interval)
        setMetrics((prev) =>
          prev.map((metric, index) => ({
            ...metric,
            value: targetValues[index],
          }))
        )
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary-green mb-2 font-heading">Our Impact in 2024</h2>
        <p className="text-gray-600 text-lg">
          Real-time metrics showing the difference we're making together
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-400 transition-all hover:shadow-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />

            <div className="relative">
              <div className="text-5xl mb-3">{metric.icon}</div>
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {metric.value.toLocaleString()}
                {metric.suffix}
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-2">{metric.label}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎯</div>
          <div>
            <h3 className="text-xl font-bold text-primary-green mb-1">Our 2025 Goal</h3>
            <p className="text-gray-700">
              Reach <strong>1,000+ students</strong>, partner with <strong>25+ schools</strong>, and complete
              <strong> 20+ cleanup events</strong> while expanding our educational game library
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">Help us achieve our goals</p>
        <a
          href="/donate"
          className="inline-block bg-primary-green hover:bg-primary-green-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
        >
          Support Our Mission →
        </a>
      </div>
    </div>
  )
}
