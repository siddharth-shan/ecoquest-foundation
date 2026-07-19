import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service',
  description: 'EcoQuest Foundation website terms covering educational resources, events, EcoChallenges, donations, intellectual property, and acceptable use.',
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
            <p className="text-sm text-gray-500 mb-8">Last updated: May 18, 2026</p>

            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the EcoQuest Foundation
              website, educational games, EcoChallenges, events, volunteer programs, donation flows,
              and any related digital resources (collectively, the "Services"). By using any part of
              the Services, you agree to these Terms. If you do not agree, please discontinue use.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">About EcoQuest Foundation</h2>
            <p className="text-gray-700 leading-relaxed">
              EcoQuest Foundation is a 501(c)(3) tax-exempt public charity (EIN 33-4376241) dedicated
              to empowering K-12 students through environmental education, interactive learning games,
              community conservation events, and youth-led service programs. Our Services are designed
              to be free, accessible, and safe for learners, families, educators, and partner
              organizations.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Educational Content and Accuracy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our games, articles, lesson resources, and challenge materials are provided strictly for
              educational and informational purposes. We make reasonable efforts to keep content
              accurate and current, but environmental data, scientific research, regulations, and
              local guidelines change continuously. The Services are not a substitute for professional
              scientific, legal, medical, or safety advice. Always follow current official guidance
              from local agencies, schools, and qualified experts.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Events, EcoChallenges, and In-Person Activities</h2>
            <p className="text-gray-700 leading-relaxed">
              Participation in EcoQuest events, cleanups, EcoChallenges, and partner activities is
              voluntary. Participants agree to follow event instructions, act in good faith, treat
              other participants and the environment respectfully, and prioritize their own personal
              safety at all times. Outdoor activities such as beach cleanups, planting events, and
              field surveys carry inherent risks (weather, terrain, wildlife, sun exposure). You are
              responsible for assessing whether an activity is appropriate for you, and for using
              appropriate protective equipment.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Participants under the age of 18 must have permission from a parent, legal guardian,
              school, or supervising organization, and must be accompanied or supervised as required
              by the event organizer. EcoQuest Foundation reserves the right to modify, postpone, or
              cancel any event or challenge for safety, weather, capacity, or operational reasons.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Donations</h2>
            <p className="text-gray-700 leading-relaxed">
              EcoQuest Foundation is a registered 501(c)(3) nonprofit, and donations made to the
              Foundation are tax-deductible to the fullest extent allowed by U.S. law. Donations
              support our educational programs, conservation events, technology
              infrastructure, and operating expenses. Donation processing is handled by third-party
              payment processors with their own terms and privacy practices, and we do not store
              full payment card details on our website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Donations are generally non-refundable. If you believe a donation was made in error,
              please contact us within 30 days and we will work with you in good faith to resolve it.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the EcoQuest Foundation website—including text, illustrations,
              photographs, game artwork, lesson plans, code, and the EcoQuest name and logo—is owned
              by or licensed to EcoQuest Foundation and is protected by copyright, trademark, and
              other intellectual property laws. Educators, students, and partner organizations are
              welcome to reference and share our public educational content with appropriate
              attribution. Commercial reuse, resale, or republication without prior written
              permission is not permitted.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">User Submissions</h2>
            <p className="text-gray-700 leading-relaxed">
              When you submit information through forms, registrations, challenge entries, or
              feedback channels, you confirm that the information is accurate, that you have the
              right to share it, and that EcoQuest Foundation may use it to operate the Services
              and to share anonymized, aggregated impact stories. Do not submit content that is
              unlawful, harmful, defamatory, or that infringes another person's rights.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree not to misuse the Services. Prohibited activities include attempting to
              gain unauthorized access to our systems, interfering with site availability, scraping
              the Services in a way that disrupts other users, submitting false or misleading
              information, impersonating others, or using EcoQuest Foundation content in ways that
              are deceptive, harmful, or commercially exploitative.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Third-Party Links and Services</h2>
            <p className="text-gray-700 leading-relaxed">
              The Services may link to third-party websites, social media accounts, or partner
              programs that are not operated by EcoQuest Foundation. We are not responsible for
              the content, policies, or practices of third-party sites. Review their terms and
              privacy policies before sharing information with them.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Disclaimer and Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              The Services are provided on an "as is" and "as available" basis without warranties of
              any kind, express or implied. To the maximum extent permitted by law, EcoQuest
              Foundation, its directors, volunteers, and partners are not liable for indirect,
              incidental, or consequential damages arising from use of the Services or
              participation in events. Some jurisdictions do not allow certain limitations, so
              portions of this section may not apply to you.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Changes to These Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time to reflect changes in our programs,
              technology, or legal requirements. The "Last updated" date above indicates when the
              Terms were most recently revised. Continued use of the Services after an update
              constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of the State of California, United States,
              without regard to conflict-of-law principles. Any disputes shall be resolved in the
              state or federal courts located in California.
            </p>

            <h2 className="text-2xl font-bold text-primary-green mt-10 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these Terms can be sent through our{' '}
              <Link href="/contact/" className="text-primary-green hover:underline">contact form</Link>{' '}
              or emailed to ecoquestfoundation@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
