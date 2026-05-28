'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function RegistrationForm() {
  const searchParams = useSearchParams()
  const eventTitle = searchParams.get('event') || 'EcoQuest Event'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    attendees: '1',
    ageGroup: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreeToTerms: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = [
      `Event: ${eventTitle}`,
      ``,
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Organization/School: ${formData.organization || 'N/A'}`,
      `Number of Attendees: ${formData.attendees}`,
      `Age Group: ${formData.ageGroup}`,
      `Dietary Restrictions / Accessibility: ${formData.dietaryRestrictions || 'None'}`,
      `Emergency Contact: ${formData.emergencyContact} (${formData.emergencyPhone})`,
    ].join('\n')

    window.location.href = `mailto:ecoquestfoundation@gmail.com?subject=${encodeURIComponent(
      `Event Registration: ${eventTitle}`
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Event Registration</h1>
          <p className="text-xl">{eventTitle}</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Register for Event</h2>
              <p className="text-gray-600">
                Fill out the form below. Clicking <strong>Send Registration</strong> opens your default
                email app with a pre-filled message addressed to us. You can also email us directly at{' '}
                <a
                  href="mailto:ecoquestfoundation@gmail.com"
                  className="text-primary-green font-semibold hover:underline"
                >
                  ecoquestfoundation@gmail.com
                </a>
                .
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary-green mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary-green mb-4">Event Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="organization"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Organization/School (Optional)
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                      placeholder="e.g., Lincoln High School, Troop 405"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="attendees"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Number of Attendees *
                    </label>
                    <select
                      id="attendees"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="ageGroup" className="block text-sm font-semibold text-gray-700 mb-2">
                  Age Group *
                </label>
                <select
                  id="ageGroup"
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                >
                  <option value="">Select age group</option>
                  <option value="child">Child (Under 13)</option>
                  <option value="teen">Teen (13-17)</option>
                  <option value="adult">Adult (18+)</option>
                  <option value="family">Family Group</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dietaryRestrictions"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Dietary Restrictions or Accessibility Needs (Optional)
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  placeholder="Please list any dietary restrictions, allergies, or accessibility needs"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary-green mb-4">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="emergencyContact"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="emergencyPhone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 mr-3 h-5 w-5 text-primary-green focus:ring-primary-green border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms/" className="text-primary-green hover:underline">
                      terms and conditions
                    </Link>{' '}
                    and acknowledge that outdoor activities carry inherent risks. I agree to follow all
                    safety guidelines provided by EcoQuest Foundation staff during the event.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Send Registration by Email
                </button>
                <Link href="/events/" className="btn btn-outline">
                  Cancel
                </Link>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Questions? Email us at{' '}
                <a
                  href="mailto:ecoquestfoundation@gmail.com"
                  className="text-primary-green hover:underline"
                >
                  ecoquestfoundation@gmail.com
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default function EventRegistration() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-xl text-gray-600">Loading registration form...</p>
          </div>
        </div>
      }
    >
      <RegistrationForm />
    </Suspense>
  )
}
