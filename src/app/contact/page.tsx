'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Contact Us</h1>
          <p className="text-xl">We'd love to hear from you!</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold mb-6 text-primary-green">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-100 border-2 border-green-500 text-green-700 p-6 rounded-lg mb-6">
                  <p className="font-semibold">Thank you for your message! We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Subject *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:outline-none"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteer Opportunity</option>
                      <option value="partnership">Partnership/Collaboration</option>
                      <option value="event">Event Information</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-green focus:outline-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary text-lg px-12">Send Message</button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4 text-primary-green">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📧</span>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <a href="mailto:info@ecoquestfoundation.org" className="text-primary-blue">info@ecoquestfoundation.org</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📱</span>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <a href="tel:+15555551234" className="text-primary-blue">(555) 555-1234</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📍</span>
                    <div>
                      <h4 className="font-semibold">Location</h4>
                      <p className="text-gray-600">Los Angeles, California</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-green/10 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-4 text-primary-green">Office Hours</h3>
                <p className="text-gray-700">Monday - Friday<br/>9:00 AM - 5:00 PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'How can my scout troop participate?', a: 'Scout troops can register for public events or contact us to arrange private events aligned with merit badge requirements.' },
              { q: 'Are programs suitable for classrooms?', a: 'Yes! Our digital resources are NGSS-aligned and designed for middle and high school students.' },
              { q: 'How can students get involved?', a: 'Students can participate in programs, volunteer at events, contribute blog content, or join our youth leadership team.' },
              { q: 'How can I stay updated?', a: 'Subscribe to our newsletter or follow us on social media for the latest updates on events and programs.' },
            ].map((faq, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-bold text-lg mb-2 text-primary-green">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
