export const metadata = {
  title: 'Get Involved - EcoQuest Foundation',
  description: 'Join as a volunteer, partner organization, or supporter. Make a difference in environmental education.',
}

export default function GetInvolved() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Get Involved</h1>
          <p className="text-xl">Join us in inspiring the next generation of environmental stewards</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Ways to Make a Difference</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🙋', title: 'Volunteer', desc: 'Join our team in conservation events, program development, and community outreach.', link: '#volunteer' },
              { icon: '🤝', title: 'Partner With Us', desc: 'Schools, scouts, and organizations can collaborate on events and programs.', link: '#partner' },
              { icon: '💚', title: 'Donate', desc: 'Support free environmental education and conservation programs for youth.', link: '#donate' },
            ].map((way, i) => (
              <div key={i} className="card card-hover p-8 text-center">
                <div className="text-6xl mb-4">{way.icon}</div>
                <h3 className="font-bold text-2xl mb-3 text-primary-green">{way.title}</h3>
                <p className="text-gray-600 mb-6">{way.desc}</p>
                <a href={way.link} className="btn btn-primary">Learn More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="volunteer" className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-6 text-primary-green font-heading">Volunteer Opportunities</h2>
          <div className="section-underline ml-0 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: '🌊 Event Coordinators', desc: 'Help organize beach cleanups and conservation events (4-8 hrs/event, 1-2 events/month)' },
              { title: '💻 Content Creators', desc: 'Create educational content, blog posts, and social media materials (Flexible, project-based)' },
              { title: '🎮 Game Development', desc: 'Contribute to our digital learning experiences (Flexible, project-based)' },
              { title: '📚 Educational Outreach', desc: 'Connect with schools and youth organizations (3-5 hours/week)' },
            ].map((role, i) => (
              <div key={i} className="bg-white border-l-4 border-primary-green p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">{role.title}</h4>
                <p className="text-gray-600">{role.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-primary-green/10 border-2 border-primary-green p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-primary-green">Ready to Volunteer?</h3>
            <p className="mb-6 text-gray-700">Fill out our volunteer application and join our team!</p>
            <button className="btn btn-primary text-lg px-10">Apply Now</button>
          </div>
        </div>
      </section>

      <section id="partner" className="section-padding">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-6 text-primary-green font-heading">Partner Organizations</h2>
          <div className="section-underline ml-0 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⛺', title: 'Scouting Troops', desc: 'Environmental service projects aligned with merit badge requirements' },
              { icon: '🏫', title: 'Schools', desc: 'NGSS-aligned programs, field trips, and professional development for educators' },
              { icon: '🌱', title: 'Community Orgs', desc: 'Collaborate on conservation events and educational outreach' },
            ].map((partner, i) => (
              <div key={i} className="card p-6">
                <div className="text-5xl mb-4">{partner.icon}</div>
                <h4 className="font-bold text-xl mb-3 text-primary-green">{partner.title}</h4>
                <p className="text-gray-600">{partner.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="donate" className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-6 text-primary-green font-heading text-center">Support Our Mission</h2>
          <div className="section-underline mb-8" />
          <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Your donation helps us provide free environmental education programs and organize community conservation events.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { amount: '$25', impact: 'Educational materials for 10 students' },
              { amount: '$50', impact: 'Cleanup supplies for one event' },
              { amount: '$100', impact: 'New educational content development' },
              { amount: '$250', impact: 'Complete conservation workshop' },
              { amount: '$500', impact: 'Full community conservation event' },
              { amount: '$1,000+', impact: 'Program sponsorship' },
            ].map((tier, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary-green mb-3">{tier.amount}</div>
                <p className="text-sm text-gray-600">{tier.impact}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="btn btn-primary text-lg px-12">Donate Now</button>
          </div>
        </div>
      </section>
    </>
  )
}
