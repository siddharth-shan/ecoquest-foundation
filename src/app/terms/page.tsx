export const metadata = {
  title: 'Terms of Service',
  description: 'EcoQuest Foundation website terms covering educational resources, events, challenges, donations, and acceptable use.',
  alternates: { canonical: '/terms/' },
  openGraph: {
    title: 'Terms of Service - EcoQuest Foundation',
    description: 'Terms for using EcoQuest Foundation website resources, programs, events, and challenge registrations.',
  },
}

export default function TermsOfService() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Terms of Service</h1>
          <p className="text-xl">Guidelines for using EcoQuest Foundation programs and resources</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              By using this website, joining programs, registering for events, or submitting forms,
              you agree to use EcoQuest Foundation resources respectfully, safely, and lawfully.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Educational Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Our games, articles, resources, and challenges are provided for educational purposes.
              We aim for accuracy, but environmental conditions, laws, and local guidelines can
              change. Always follow local safety instructions and official guidance.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Events and Challenges</h2>
            <p className="text-gray-700 leading-relaxed">
              Participants agree to follow event instructions, act in good faith, respect other
              participants, and prioritize personal safety during outdoor or community activities.
              Minors should participate with appropriate parent, guardian, school, or organization
              permission.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Donations</h2>
            <p className="text-gray-700 leading-relaxed">
              Donations support EcoQuest Foundation programs, educational tools, conservation
              events, and related operations. Donation processing may be handled by third-party
              providers with their own terms and privacy practices.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed">
              Do not misuse the website, submit false information, interfere with site operation,
              or use EcoQuest Foundation content in a misleading or harmful way.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these terms can be sent through our contact form.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
