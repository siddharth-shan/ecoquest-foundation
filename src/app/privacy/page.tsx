export const metadata = {
  title: 'Privacy Policy',
  description: 'EcoQuest Foundation privacy policy for website visitors, volunteers, donors, newsletter subscribers, and event participants.',
  alternates: { canonical: '/privacy/' },
  openGraph: {
    title: 'Privacy Policy - EcoQuest Foundation',
    description: 'How EcoQuest Foundation collects, uses, and protects information from website visitors and program participants.',
  },
}

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-gradient-eco text-white text-center py-24">
        <div className="container-custom">
          <h1 className="text-5xl font-bold mb-4 font-heading">Privacy Policy</h1>
          <p className="text-xl">How we handle information shared with EcoQuest Foundation</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              EcoQuest Foundation collects only the information needed to run our website, programs,
              events, newsletters, volunteer opportunities, and donor communications.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              We may collect contact details, registration information, newsletter preferences,
              donation details, and messages submitted through forms on this website. Payment
              information is handled by our payment processor and is not stored directly on this site.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">How We Use Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use information to respond to inquiries, coordinate events, send requested updates,
              process volunteer or challenge registrations, acknowledge donations, and improve our
              educational programs.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell personal information. We may share limited information with trusted
              service providers that help operate our website, email, events, analytics, and payment
              processing.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Your Choices</h2>
            <p className="text-gray-700 leading-relaxed">
              You can unsubscribe from email updates at any time. To update or request deletion of
              information you submitted, contact us through the contact page.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about this policy can be sent through our contact form.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
