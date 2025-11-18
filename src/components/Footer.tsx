import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4">EcoQuest Foundation</h4>
            <p className="text-gray-400 leading-relaxed mb-4">
              Inspiring and educating youth about environmental conservation through interactive digital experiences and community action.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-green transition-colors" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-primary-green transition-colors" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-primary-green transition-colors" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="hover:text-primary-green transition-colors" aria-label="YouTube">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-primary-green transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="text-gray-400 hover:text-primary-green transition-colors">Our Programs</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-primary-green transition-colors">Events</Link></li>
              <li><Link href="/resources" className="text-gray-400 hover:text-primary-green transition-colors">Resources</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li><Link href="/get-involved#volunteer" className="text-gray-400 hover:text-primary-green transition-colors">Volunteer</Link></li>
              <li><Link href="/get-involved#partner" className="text-gray-400 hover:text-primary-green transition-colors">Partner With Us</Link></li>
              <li><Link href="/get-involved#donate" className="text-gray-400 hover:text-primary-green transition-colors">Donate</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary-green transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated on our latest programs and events.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green"
                required
              />
              <button type="submit" className="btn btn-primary px-6 py-2">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 EcoQuest Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-primary-green transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary-green transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
