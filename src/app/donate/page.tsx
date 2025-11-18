'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DonatePage() {
  const [amount, setAmount] = useState('50')
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once')
  const [selectedImpact, setSelectedImpact] = useState('')

  const presetAmounts = ['25', '50', '100', '250', '500']

  const impactLevels = [
    {
      amount: 25,
      title: 'Seedling Supporter',
      impact: [
        '🌱 Provide educational materials for 5 students',
        '📚 Support one classroom game session',
        '🎒 Supply cleanup kits for a small team',
      ],
      icon: '🌱',
      color: 'from-green-400 to-emerald-500',
    },
    {
      amount: 50,
      title: 'Tree Planter',
      impact: [
        '🌳 Fund educational programs for 15 students',
        '🎮 Sponsor full game access for a classroom',
        '🧹 Equip a beach cleanup event',
      ],
      icon: '🌳',
      color: 'from-green-500 to-emerald-600',
    },
    {
      amount: 100,
      title: 'Forest Guardian',
      impact: [
        '🏫 Support a full school assembly program',
        '📱 Provide interactive app access for 50 students',
        '🏖️ Sponsor a major beach cleanup event',
      ],
      icon: '🌲',
      color: 'from-green-600 to-emerald-700',
    },
    {
      amount: 250,
      title: 'Ecosystem Champion',
      impact: [
        '🎓 Fund teacher training workshops',
        '🌍 Support month-long environmental campaign',
        '🦋 Enable biodiversity tracking program',
      ],
      icon: '🦋',
      color: 'from-blue-500 to-green-600',
    },
    {
      amount: 500,
      title: 'Planet Hero',
      impact: [
        '🏆 Launch new educational game',
        '🌊 Fund quarterly cleanup initiatives',
        '📊 Enable impact tracking for 500+ students',
      ],
      icon: '🌍',
      color: 'from-blue-600 to-purple-600',
    },
  ]

  const getCurrentImpact = () => {
    const donationAmount = customAmount || amount
    const numAmount = parseInt(donationAmount)
    return impactLevels.find((level) => level.amount >= numAmount) || impactLevels[impactLevels.length - 1]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Support Our Mission</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your donation directly powers environmental education and conservation action for the next generation
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-primary-green mb-6">Make Your Gift</h2>

              {/* Frequency Toggle */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Donation Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFrequency('once')}
                    className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                      frequency === 'once'
                        ? 'bg-primary-green text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    One-Time Gift
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`py-4 px-6 rounded-lg font-semibold transition-all relative ${
                      frequency === 'monthly'
                        ? 'bg-primary-green text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="absolute -top-2 -right-2 bg-accent-yellow text-primary-green text-xs px-2 py-1 rounded-full font-bold">
                      2x Impact!
                    </span>
                    Monthly Gift
                  </button>
                </div>
                {frequency === 'monthly' && (
                  <p className="text-sm text-green-600 mt-2 font-semibold">
                    💚 Monthly donors sustain our programs year-round and receive special updates!
                  </p>
                )}
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset)
                        setCustomAmount('')
                      }}
                      className={`py-4 px-4 rounded-lg font-bold text-lg transition-all ${
                        amount === preset && !customAmount
                          ? 'bg-primary-green text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Other amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount('')
                    }}
                    className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  />
                </div>
              </div>

              {/* Your Impact Preview */}
              {(amount || customAmount) && (
                <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-5xl">{getCurrentImpact().icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary-green">
                        {getCurrentImpact().title}
                      </h3>
                      <p className="text-gray-600">Your ${customAmount || amount} gift enables:</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {getCurrentImpact().impact.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Donation Form */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <p className="font-semibold mb-1">Secure Donation Processing</p>
                    <p className="text-xs text-gray-600">
                      This is a demonstration form. In production, integrate with Stripe, PayPal, or Donorbox
                      for secure payment processing. All transactions would be encrypted and PCI-compliant.
                    </p>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="newsletter" className="mt-1" />
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    Yes! Send me updates about EcoQuest Foundation's impact and programs
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-green to-emerald-600 hover:from-primary-green-dark hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Complete Donation - ${customAmount || amount}
                  {frequency === 'monthly' && '/month'}
                </button>

                <p className="text-xs text-center text-gray-600">
                  EcoQuest Foundation is a 501(c)(3) nonprofit. Your donation is tax-deductible to the extent
                  allowed by law. Tax ID: XX-XXXXXXX
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Donate */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">Why Your Gift Matters</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="font-semibold mb-1">Direct Impact</p>
                    <p className="text-gray-600">85% of donations go directly to programs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <p className="font-semibold mb-1">Youth Empowerment</p>
                    <p className="text-gray-600">Educating the next generation of environmental leaders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="font-semibold mb-1">Measurable Results</p>
                    <p className="text-gray-600">Track your impact with quarterly reports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Ways to Give */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">Other Ways to Give</h3>
              <div className="space-y-3 text-sm">
                <Link
                  href="/contact"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">Corporate Sponsorship</p>
                  <p className="text-gray-600 text-xs">Partner with us for lasting impact</p>
                </Link>
                <Link
                  href="/contact"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">Planned Giving</p>
                  <p className="text-gray-600 text-xs">Leave a legacy for future generations</p>
                </Link>
                <Link
                  href="/contact"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">Stock Donations</p>
                  <p className="text-gray-600 text-xs">Tax-efficient giving options</p>
                </Link>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">2024 Impact So Far</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-sm opacity-90">Students Reached</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">15</div>
                  <div className="text-sm opacity-90">Schools Partnered</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">3</div>
                  <div className="text-sm opacity-90">Beach Cleanups Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
