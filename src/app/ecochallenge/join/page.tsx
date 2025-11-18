'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ChallengeForm() {
  const searchParams = useSearchParams()
  const challengeTitle = searchParams.get('challenge') || 'Monthly EcoChallenge'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    grade: '',
    school: '',
    parentEmail: '',
    teamName: '',
    participationType: 'individual',
    previousChallenges: 'no',
    motivation: '',
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
    }, 1500)
  }

  return (
    <>
      <div className="bg-gradient-to-r from-primary-blue to-primary-green text-white text-center py-20">
        <div className="container-custom">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Join the EcoChallenge!</h1>
          <p className="text-xl">{challengeTitle}</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {status === 'success' ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Welcome to the Challenge!</h2>
              <p className="text-lg text-green-700 mb-6">
                You're now registered for {challengeTitle}! We've sent you an email with:
              </p>
              <div className="bg-white rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">Challenge guidelines and rules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">Tracking sheet to log your progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">Tips and resources to help you succeed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">Community forum access to connect with other participants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span className="text-gray-700">Digital badge upon completion!</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/programs#ecochallenge" className="btn btn-primary">
                  View All Challenges
                </Link>
                <Link href="/blog" className="btn btn-outline">
                  Read Success Stories
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up for the Challenge</h2>
                <p className="text-gray-600">
                  Join students across California in making a positive environmental impact this month!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold text-primary-green mb-4">Your Information</h3>
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

                {/* Contact & School Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Email Address *
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
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="5"
                      max="18"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
                      Grade Level *
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      <option value="">Select grade</option>
                      <option value="K">Kindergarten</option>
                      <option value="1">1st Grade</option>
                      <option value="2">2nd Grade</option>
                      <option value="3">3rd Grade</option>
                      <option value="4">4th Grade</option>
                      <option value="5">5th Grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="school" className="block text-sm font-semibold text-gray-700 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                      placeholder="e.g., Lincoln Middle School"
                    />
                  </div>
                </div>

                {/* Parent/Guardian Email (for under 13) */}
                <div>
                  <label htmlFor="parentEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Email * <span className="text-gray-500 font-normal">(Required for participants under 13)</span>
                  </label>
                  <input
                    type="email"
                    id="parentEmail"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>

                {/* Participation Details */}
                <div>
                  <h3 className="text-xl font-bold text-primary-green mb-4">Participation Details</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      How will you participate? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="participationType"
                          value="individual"
                          checked={formData.participationType === 'individual'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">Individual (just me)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="participationType"
                          value="team"
                          checked={formData.participationType === 'team'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">Team (with friends/classmates)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="participationType"
                          value="family"
                          checked={formData.participationType === 'family'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">Family (with my family)</span>
                      </label>
                    </div>
                  </div>

                  {formData.participationType === 'team' && (
                    <div className="mb-4">
                      <label htmlFor="teamName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                        placeholder="e.g., Green Warriors, Eco Squad"
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Have you completed an EcoChallenge before? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="previousChallenges"
                          value="no"
                          checked={formData.previousChallenges === 'no'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">No, this is my first challenge</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="previousChallenges"
                          value="1-2"
                          checked={formData.previousChallenges === '1-2'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">Yes, 1-2 challenges</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="previousChallenges"
                          value="3+"
                          checked={formData.previousChallenges === '3+'}
                          onChange={handleChange}
                          className="mr-3 h-4 w-4 text-primary-green focus:ring-primary-green"
                        />
                        <span className="text-gray-700">Yes, 3+ challenges (I'm an EcoChampion!)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
                    Why do you want to join this challenge? (Optional)
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    placeholder="Tell us what motivates you to take environmental action..."
                  />
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
                      I agree to participate in good faith, track my progress honestly, and follow the <Link href="/terms" className="text-primary-green hover:underline">challenge guidelines</Link>. I understand that EcoQuest Foundation may share anonymized success stories and data from this challenge.
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
                        Registering...
                      </span>
                    ) : (
                      'Join the Challenge!'
                    )}
                  </button>
                  <Link href="/programs#ecochallenge" className="btn btn-outline">
                    Cancel
                  </Link>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Questions? Email us at <a href="mailto:ecochallenge@ecoquest.org" className="text-primary-green hover:underline">ecochallenge@ecoquest.org</a>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function JoinEcoChallenge() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-xl text-gray-600">Loading challenge registration...</p>
        </div>
      </div>
    }>
      <ChallengeForm />
    </Suspense>
  )
}
