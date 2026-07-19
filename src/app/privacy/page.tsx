import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'EcoQuest Foundation privacy policy describing what information is collected from website visitors, volunteers, donors, newsletter subscribers, and event participants, and how it is used and protected.',
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
            <p className="text-sm text-gray-500 mb-8">Last updated: May 18, 2026</p>

            <p className="text-gray-700 leading-relaxed">
              EcoQuest Foundation ("EcoQuest", "we", "our", or "us") is a 501(c)(3) nonprofit
              (EIN 33-4376241) committed to protecting the privacy of students, families,
              educators, volunteers, donors, and visitors to our website. This Privacy Policy
              describes the limited information we collect through our website and programs, how
              we use it, the choices you have, and the steps we take to keep it safe.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              We only collect information that is necessary to run our website, programs, events,
              newsletters, volunteer opportunities, and donor communications. Specifically, we may
              collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>
                <strong>Contact information</strong> you provide through forms — name, email
                address, school or organization, and any message you choose to send.
              </li>
              <li>
                <strong>Event and EcoChallenge registrations</strong> — including parent or guardian
                contact details for participants under 18, t-shirt sizes (when relevant), and
                emergency contact information.
              </li>
              <li>
                <strong>Newsletter preferences</strong> — your email address and the topics you have
                opted in to receive updates about.
              </li>
              <li>
                <strong>Donation details</strong> — donor name, contact information, donation amount,
                and acknowledgment preferences. Payment card information is handled directly by
                our third-party payment processor and is never stored on our servers.
              </li>
              <li>
                <strong>Anonymous usage data</strong> — basic analytics such as page views, referring
                site, approximate region, and device type, used in aggregate to improve the site.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">How We Use Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-2">
              <li>Respond to inquiries and partnership requests.</li>
              <li>Coordinate events, EcoChallenges, and volunteer activities, including safety follow-up.</li>
              <li>Send newsletters and program updates you have requested.</li>
              <li>Acknowledge donations, issue tax receipts, and comply with applicable nonprofit reporting requirements.</li>
              <li>Improve our website, educational games, and lesson resources.</li>
              <li>Share anonymized, aggregated impact stories (for example, the number of volunteers who joined a cleanup) with supporters and partners.</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our programs are designed for K-12 audiences. We do not knowingly collect personal
              information directly from children under 13 without verifiable consent from a parent,
              guardian, or supervising educator. When children participate through a school,
              classroom program, or partner organization, we typically work with the educator or
              organization as the primary point of contact. Parents, guardians, and educators may
              contact us to review, correct, or request deletion of any information related to a
              minor in their care.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Sharing of Information</h2>
            <p className="text-gray-700 leading-relaxed">
              EcoQuest Foundation does not sell, rent, or trade personal information. We may share
              limited information with trusted service providers who help us operate the
              Foundation — for example, email delivery, event registration platforms, analytics,
              and payment processing. These providers are only authorized to use information as
              needed to provide their services to us, and are required to keep it confidential.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We may disclose information if required to do so by law, to comply with a legal
              process, to protect the safety of participants, or to protect the rights and
              property of EcoQuest Foundation.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Cookies and Analytics</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may use a small number of cookies and similar technologies to remember
              preferences and to measure aggregate site usage. You can control cookies through
              your browser settings. Disabling cookies may affect some interactive features but
              will not prevent you from accessing core educational content.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Data Retention and Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain information only for as long as needed to fulfill the purposes described
              in this policy, to comply with legal and accounting requirements, and to support
              ongoing program participation. We use reasonable administrative, technical, and
              physical safeguards to protect information, including encryption in transit,
              restricted access, and vetted third-party providers. No method of internet
              transmission is fully secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Your Choices</h2>
            <p className="text-gray-700 leading-relaxed">
              You can unsubscribe from newsletters at any time using the unsubscribe link in any
              email, or by contacting us. You may request access to, correction of, or deletion of
              information you have submitted, subject to legal and recordkeeping obligations
              applicable to a registered 501(c)(3) nonprofit.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our
              programs, technology, or legal requirements. The "Last updated" date above
              indicates when this policy was most recently revised. Material changes will be
              highlighted on this page.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions, concerns, or requests related to this policy can be sent through our{' '}
              <Link href="/contact/" className="text-primary-green hover:underline">contact form</Link>{' '}
              or by email to ecoquestfoundation@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
