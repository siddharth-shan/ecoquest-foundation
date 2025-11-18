'use client'

import { useState } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  organization?: string
  quote: string
  image: string
  impact: string
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Martinez',
      role: '5th Grade Teacher',
      organization: 'Oakwood Elementary',
      quote:
        "The Guardians of the Green game transformed how my students engage with environmental science. They're not just learning—they're actively problem-solving and making real decisions about ecosystem management.",
      image: '👩‍🏫',
      impact: 'Used games with 3 classes, 75+ students',
    },
    {
      id: 2,
      name: 'James Chen',
      role: 'Scout Troop Leader',
      organization: 'Troop 405, San Diego',
      quote:
        'Our partnership with EcoQuest Foundation for beach cleanups has been incredible. The kids learned about marine pollution, collected over 200 pounds of trash, and earned their environmental badges!',
      image: '👨‍🦱',
      impact: '3 cleanup events, 30+ scouts participated',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'High School Student',
      organization: 'Lincoln High, Grade 11',
      quote:
        'Playing the Carbon Footprint Quest game made climate change feel personal and actionable. I started tracking my own carbon footprint and convinced my family to make changes. Small actions really do add up!',
      image: '👧',
      impact: 'Reduced family carbon footprint by 15%',
    },
    {
      id: 4,
      name: 'Dr. Michael Thompson',
      role: 'Environmental Science Director',
      organization: 'Green Valley School District',
      quote:
        'EcoQuest Foundation provides NGSS-aligned content that seamlessly integrates into our curriculum. The games are engaging, educational, and backed by sound environmental science.',
      image: '👨‍🔬',
      impact: 'District-wide adoption across 8 schools',
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Parent & Volunteer',
      quote:
        'Watching my daughter become passionate about ocean conservation through the Oceanaware Guardian app has been amazing. She now leads our family recycling efforts and educates her younger siblings!',
      image: '👩',
      impact: 'Family sustainability transformation',
    },
    {
      id: 6,
      name: 'Carlos Mendez',
      role: 'Middle School Principal',
      organization: 'Riverside Academy',
      quote:
        "EcoQuest's school assembly program was outstanding. Interactive, age-appropriate, and inspiring. Students are still talking about it weeks later and asking when they can play the games.",
      image: '👨‍💼',
      impact: '450 students reached in one assembly',
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[activeIndex]

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary-green mb-2 font-heading">Community Impact Stories</h2>
        <p className="text-gray-600 text-lg">Hear from educators, students, and volunteers making a difference</p>
      </div>

      {/* Main Testimonial Card */}
      <div className="bg-white rounded-xl p-8 mb-6 min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{current.image}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{current.name}</h3>
              <p className="text-primary-blue font-semibold">{current.role}</p>
              {current.organization && (
                <p className="text-sm text-gray-600">{current.organization}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-6xl text-primary-green/20 mb-2">"</div>
            <p className="text-lg text-gray-700 italic leading-relaxed">{current.quote}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-primary-green">
          <p className="text-sm font-semibold text-primary-green">Impact: {current.impact}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevTestimonial}
          className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
          aria-label="Previous testimonial"
        >
          <svg
            className="w-6 h-6 text-primary-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeIndex ? 'bg-primary-green w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextTestimonial}
          className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-colors"
          aria-label="Next testimonial"
        >
          <svg
            className="w-6 h-6 text-primary-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center bg-white rounded-lg p-6">
        <p className="text-gray-700 mb-4">Want to share your EcoQuest story?</p>
        <a
          href="/contact"
          className="inline-block bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Tell Us Your Story →
        </a>
      </div>
    </div>
  )
}
