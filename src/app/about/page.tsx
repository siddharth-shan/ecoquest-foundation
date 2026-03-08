export const metadata = {
  title: 'About Us - EcoQuest Foundation',
  description: 'Learn about EcoQuest Foundation\'s mission, vision, and impact in environmental education and youth engagement.',
}

export default function About() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">About EcoQuest Foundation</h1>
          <p className="text-xl">Empowering the next generation of environmental stewards</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-primary-green font-heading">Our Mission</h2>
              <div className="section-underline ml-0" />
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                At EcoQuest Foundation, our mission is to <strong>inspire and educate youth and the broader public about environmental conservation and sustainability</strong> through innovative, interactive, and engaging digital experiences.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We design and maintain age-appropriate websites, educational games, and challenges that make learning about ecological issues fun and impactful. Our digital content is crafted to align with environmental science standards, supporting both formal and informal learning environments.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Beyond the screen, we collaborate with local community organizations and Scouting of America troops to host hands-on conservation events such as beach and park cleanups—empowering young people to take real-world action for a healthier planet.
              </p>
            </div>
            <div className="bg-primary-green/10 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-8xl">🌍</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">What We've Done</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎮', title: 'Built 4 Educational Games', desc: 'Guardians of the Green, Ocean Cleanup Challenge, Recycling Hero, and Carbon Footprint Quest for K-12 students.' },
              { icon: '🏛️', title: 'Entered National Competitions', desc: 'Submitted apps to Congressional App Challenge, Blue Ocean Entrepreneurship Competition, and Bowseat Ocean Awareness Contest.' },
              { icon: '🏖️', title: '3 Community Cleanups', desc: 'Organized cleanups at Seal Beach, Cerritos Heritage Park, and Cerritos Park East with 35+ volunteers.' },
              { icon: '✍️', title: 'Student-Published Research', desc: 'Original articles on monarch conservation, ocean plastic crisis, and wildfire prevention published on Medium.' },
            ].map((item, i) => (
              <div key={i} className="card p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-primary-green">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
            <div className="section-underline" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '🌍 Environmental Stewardship', desc: 'Protecting our planet for future generations through education and action.' },
              { title: '🎓 Educational Excellence', desc: 'High-quality, research-backed content meeting educational standards.' },
              { title: '🤝 Community Collaboration', desc: 'Partnering with schools, scouts, and organizations for collective impact.' },
              { title: '💡 Innovation', desc: 'Leveraging technology and creativity for accessible environmental education.' },
              { title: '🌱 Youth Empowerment', desc: 'Young people have the power to drive change and deserve platforms to lead.' },
              { title: '🔬 Science-Based', desc: 'Content grounded in scientific research and evidence-based practices.' },
            ].map((value, i) => (
              <div key={i} className="card card-hover p-6">
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
