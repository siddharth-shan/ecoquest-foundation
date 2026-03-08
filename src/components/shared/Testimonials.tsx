export default function CommunityVoices() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary-green mb-2 font-heading">Community Voices</h2>
        <p className="text-gray-600 text-lg">We'd love to hear about your experience with EcoQuest Foundation</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: '🎓', title: 'Educators', desc: 'Share how our games and resources have impacted your classroom' },
          { icon: '👨‍👩‍👧‍👦', title: 'Families', desc: 'Tell us how EcoQuest has inspired environmental action at home' },
          { icon: '🌱', title: 'Volunteers', desc: 'Share your experience at our community cleanup events' },
        ].map((category, i) => (
          <div key={i} className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-green-300 transition-colors">
            <div className="text-5xl mb-3">{category.icon}</div>
            <h3 className="font-bold text-lg text-primary-green mb-2">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center bg-white rounded-lg p-6">
        <p className="text-gray-700 mb-4">Have an EcoQuest story to share? We'd love to feature it!</p>
        <a
          href="/contact"
          className="inline-block bg-primary-green hover:bg-primary-green-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Share Your Story →
        </a>
      </div>
    </div>
  )
}
