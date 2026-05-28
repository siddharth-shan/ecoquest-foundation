'use client'

import { useState } from 'react'

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'footer'
}

const MAILTO_HREF =
  'mailto:ecoquestfoundation@gmail.com?subject=Newsletter%20Signup&body=' +
  encodeURIComponent(
    'Hi EcoQuest Foundation,\n\nPlease add me to your newsletter list. My email is: \n\nThanks!'
  )

export default function NewsletterSignup({ variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const href =
      'mailto:ecoquestfoundation@gmail.com?subject=Newsletter%20Signup&body=' +
      encodeURIComponent(
        `Hi EcoQuest Foundation,\n\nPlease add me to your newsletter list.\n\nMy email: ${email}\n\nThanks!`
      )
    window.location.href = href
  }

  if (variant === 'footer') {
    return (
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Stay Connected</h3>
        <p className="text-sm text-gray-300 mb-4">
          Email us to get updates on our programs, events, and environmental initiatives.
        </p>
        <a
          href={MAILTO_HREF}
          className="inline-block px-6 py-2 bg-white text-primary-green font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          📧 Subscribe by Email
        </a>
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
            <p className="text-sm text-green-100">Get program updates and impact stories</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-primary-green font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-white/80 mt-2">
          Clicking Subscribe opens your default email app addressed to us.
        </p>
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
          Email us to receive program updates, impact stories, and ways to get involved.
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
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-primary-green hover:bg-primary-green-dark text-white font-bold rounded-lg transition-colors"
          >
            Subscribe
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Clicking Subscribe opens your default email app with a message addressed to{' '}
          <a
            href="mailto:ecoquestfoundation@gmail.com"
            className="text-primary-green hover:underline"
          >
            ecoquestfoundation@gmail.com
          </a>
          .
        </p>
      </form>

      <div className="grid md:grid-cols-3 gap-4 mt-8 text-sm">
        <div className="text-center">
          <div className="text-2xl mb-1">📧</div>
          <p className="text-gray-700 font-semibold">Program Updates</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🎯</div>
          <p className="text-gray-700 font-semibold">Impact Stories</p>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🌟</div>
          <p className="text-gray-700 font-semibold">Event Announcements</p>
        </div>
      </div>
    </div>
  )
}
