'use client'

import { useState, Suspense } from 'react'
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

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate API call - ready for backend integration
    setTimeout(() => {
      setStatus('success')
      // Reset form after success
      setTimeout(() => {
        setFormData({
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
        setStatus('idle')
      }, 3000)
    }, 1500)
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
          {status === 'success' ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Registration Successful!</h2>
              <p className="text-lg text-green-700 mb-6">
                Thank you for registering for {eventTitle}. We've sent a confirmation email with all the event details and what to bring.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/events" className="btn btn-primary">
                  Back to Events
                </Link>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn btn-outline"
                >
                  Register Another Person
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Register for Event</h2>
                <p className="text-gray-600">Please fill out the form below to secure your spot at this event.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
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

                {/* Contact Information */}
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

                {/* Event Details */}
                <div>
                  <h3 className="text-xl font-bold text-primary-green mb-4">Event Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      <label htmlFor="attendees" className="block text-sm font-semibold text-gray-700 mb-2">
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
                          <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
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
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-semibold text-gray-700 mb-2">
                    Dietary Restrictions or Allergies (Optional)
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

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-xl font-bold text-primary-green mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      <label htmlFor="emergencyPhone" className="block text-sm font-semibold text-gray-700 mb-2">
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

                {/* Terms & Conditions */}
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
                      I agree to the <Link href="/terms" className="text-primary-green hover:underline">terms and conditions</Link> and understand that I will receive event updates and safety information via email. I acknowledge that outdoor activities carry inherent risks and agree to follow all safety guidelines provided by EcoQuest Foundation staff.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                  <Link href="/events" className="btn btn-outline">
                    Cancel
                  </Link>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Questions? Contact us at <a href="mailto:events@ecoquest.org" className="text-primary-green hover:underline">events@ecoquest.org</a>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function EventRegistration() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-xl text-gray-600">Loading registration form...</p>
        </div>
      </div>
    }>
      <RegistrationForm />
    </Suspense>
  )
}
