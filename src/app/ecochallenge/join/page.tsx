'use client'

import { Suspense, useState } from 'react'
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
      `Challenge: ${challengeTitle}`,
      ``,
      `Name: ${formData.firstName} ${formData.lastName}`,
      `Email: ${formData.email}`,
      `Age: ${formData.age}`,
      `Grade: ${formData.grade}`,
      `School: ${formData.school}`,
      `Parent/Guardian Email: ${formData.parentEmail}`,
      `Participation: ${formData.participationType}${
        formData.participationType === 'team' && formData.teamName
          ? ` (Team: ${formData.teamName})`
          : ''
      }`,
      `Previous Challenges: ${formData.previousChallenges}`,
      `Motivation: ${formData.motivation || 'N/A'}`,
    ].join('\n')

    window.location.href = `mailto:ecoquestfoundation@gmail.com?subject=${encodeURIComponent(
      `EcoChallenge Signup: ${challengeTitle}`
    )}&body=${encodeURIComponent(body)}`
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
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up for the Challenge</h2>
              <p className="text-gray-600">
                Fill out the form below. Clicking <strong>Send Signup</strong> opens your default email
                app with a pre-filled message addressed to us. Parents/guardians can also email us
                directly at{' '}
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
                <h3 className="text-xl font-bold text-primary-green mb-4">Your Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
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

              <div>
                <label
                  htmlFor="parentEmail"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Parent/Guardian Email *{' '}
                  <span className="text-gray-500 font-normal">(Required for participants under 13)</span>
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
                    <label
                      htmlFor="teamName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
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
                      <span className="text-gray-700">Yes, 3 or more challenges</span>
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
                    I agree to participate in good faith and follow the{' '}
                    <Link href="/terms/" className="text-primary-green hover:underline">
                      challenge guidelines
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Send Signup by Email
                </button>
                <Link href="/programs/#ecochallenge" className="btn btn-outline">
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

export default function JoinEcoChallenge() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-600">Loading challenge signup...</p>
          </div>
        </div>
      }
    >
      <ChallengeForm />
    </Suspense>
  )
}
