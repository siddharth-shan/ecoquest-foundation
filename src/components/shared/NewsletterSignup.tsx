'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'footer'
}

export default function NewsletterSignup({ variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate API call - Replace with actual newsletter service integration
    // (Mailchimp, SendGrid, ConvertKit, etc.)
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  if (variant === 'footer') {
    return (
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Stay Connected</h3>
        <p className="text-sm text-gray-300 mb-4">
          Get updates on our latest programs, events, and environmental initiatives
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-2 bg-white text-primary-green font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'success' ? '✓' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-sm text-green-300 mt-2">✓ Successfully subscribed!</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-300 mt-2">Something went wrong. Please try again.</p>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-primary-green to-emerald-600 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">📬</div>
          <div>
            <h3 className="text-xl font-bold text-white">Join Our Community</h3>
            <p className="text-sm text-green-100">Get monthly updates and impact stories</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 bg-white text-primary-green font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : status === 'success' ? '✓' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-sm text-white mt-2">✓ Welcome to the EcoQuest community!</p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-3xl font-bold text-primary-green mb-2">Stay in the Loop</h2>
        <p className="text-gray-600">
          Join our newsletter for monthly impact stories, program updates, and ways to get involved
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-8 py-3 bg-primary-green hover:bg-primary-green-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </div>

        {status === 'success' && (
          <p className="text-center text-green-600 mt-4 font-semibold">
            ✓ Thank you! Check your email to confirm your subscription.
          </p>
        )}
        {status === 'error' && (
          <p className="text-center text-red-600 mt-4">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-xs text-center text-gray-500 mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>

      <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm">
        <div className="text-center">
          <div className="text-2xl mb-1">📧</div>
          <p className="text-gray-700 font-semibold">Monthly Updates</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🎯</div>
          <p className="text-gray-700 font-semibold">Impact Stories</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🌟</div>
          <p className="text-gray-700 font-semibold">Exclusive Content</p>
        </div>
      </div>
    </div>
  )
}
