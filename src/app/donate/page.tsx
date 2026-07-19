import Link from 'next/link'

export default function DonatePage() {
  const givingAreas = [
    {
      icon: '🎮',
      title: 'Educational Games & Apps',
      desc: 'Building and maintaining our free interactive games and web apps for K-12 students',
    },
    {
      icon: '🏖️',
      title: 'Community Cleanups',
      desc: 'Supplies, gloves, grabbers, and bags for our beach and park cleanup events',
    },
    {
      icon: '📚',
      title: 'Learning Materials',
      desc: 'Educational content and resources shared with students, families, and volunteers',
    },
    {
      icon: '🌱',
      title: 'Program Operations',
      desc: 'The day-to-day costs of running a student-led nonprofit and growing our reach',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Support Our Mission</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Help power environmental education and conservation action for the next generation
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Donation Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <h2 className="text-3xl font-bold text-primary-green mb-4">Make a Tax-Deductible Donation</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                EcoQuest Foundation is a 501(c)(3) tax-exempt nonprofit recognized by the Internal Revenue Service.
                Contributions are tax-deductible to the fullest extent allowed by law.
              </p>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-xl text-primary-green mb-3">How to Donate</h3>
                <p className="text-gray-700 mb-4">
                  We are currently setting up our online donation processor. In the meantime, please contact us
                  directly to make a contribution. We&apos;ll provide instructions for check, ACH, or wire transfer
                  and send you an official tax-deductible donation receipt.
                </p>
                <a
                  href="mailto:ecoquestfoundation@gmail.com?subject=Donation%20Inquiry"
                  className="inline-block bg-gradient-to-r from-primary-green to-emerald-600 hover:from-primary-green-dark hover:to-emerald-700 text-white font-bold text-lg px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  📧 Contact Us to Donate
                </a>
                <p className="text-sm text-gray-600 mt-3">
                  Email{' '}
                  <a
                    href="mailto:ecoquestfoundation@gmail.com"
                    className="text-primary-green font-semibold hover:underline"
                  >
                    ecoquestfoundation@gmail.com
                  </a>
                </p>
              </div>

              <h3 className="font-bold text-xl text-primary-green mb-4">Where Your Gift Goes</h3>
              <p className="text-gray-700 mb-4">
                Every contribution—of any size—directly supports our student-led environmental education
                and community conservation work, including:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {givingAreas.map((area, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{area.icon}</div>
                      <div>
                        <div className="font-bold text-primary-green">{area.title}</div>
                        <p className="text-sm text-gray-700 mt-1">{area.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600">
                EcoQuest Foundation is a 501(c)(3) nonprofit. Your donation is tax-deductible to the extent
                allowed by law. EIN: 33-4376241.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">Why Your Gift Matters</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="font-semibold mb-1">Direct Impact</p>
                    <p className="text-gray-600">Funds environmental education and community cleanup programs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <p className="font-semibold mb-1">Youth Empowerment</p>
                    <p className="text-gray-600">Supports the next generation of environmental leaders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="font-semibold mb-1">Transparent Reporting</p>
                    <p className="text-gray-600">Annual program updates and impact summaries available on request</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-primary-green mb-4">Other Ways to Give</h3>
              <div className="space-y-3 text-sm">
                <Link
                  href="/contact/"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">Corporate Sponsorship</p>
                  <p className="text-gray-600 text-xs">Partner with us for lasting impact</p>
                </Link>
                <Link
                  href="/contact/"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">Planned Giving</p>
                  <p className="text-gray-600 text-xs">Leave a legacy for future generations</p>
                </Link>
                <Link
                  href="/contact/"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-semibold">In-Kind Donations</p>
                  <p className="text-gray-600 text-xs">Supplies, equipment, or services</p>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">What We&apos;ve Done</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold">7+</div>
                  <div className="text-sm opacity-90">Community Cleanups</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">35+</div>
                  <div className="text-sm opacity-90">Community Members Engaged</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4</div>
                  <div className="text-sm opacity-90">Educational Games Built</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4</div>
                  <div className="text-sm opacity-90">Interactive Web Apps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
