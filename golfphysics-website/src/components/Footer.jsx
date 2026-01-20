import { Link } from 'react-router-dom'
import { Target, Gamepad2 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    products: [
      { label: 'Professional API', path: '/professional', icon: Target, color: 'text-pro-blue' },
      { label: 'Gaming API', path: '/gaming', icon: Gamepad2, color: 'text-gaming-orange' },
      { label: 'Pricing', path: '/pricing' },
    ],
    resources: [
      { label: 'Documentation', path: '/docs' },
      { label: 'Science', path: '/science' },
      { label: 'SDKs', path: '/docs#sdks' },
    ],
    company: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
    connect: [
      { label: 'Twitter', href: 'https://twitter.com/golfphysicsio', external: true },
      { label: 'GitHub', href: 'https://github.com/golfphysicsio', external: true },
      { label: 'Email', href: 'mailto:hello@golfphysics.io', external: true },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⛳</span>
              <span className="text-lg font-bold text-white">Golf Physics</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Real physics for golf technology. Professional accuracy or extreme entertainment.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-pro-blue/20 text-pro-blue px-2 py-1 rounded">Professional</span>
              <span className="text-xs bg-gaming-orange/20 text-gaming-orange px-2 py-1 rounded">Gaming</span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-white transition-colors flex items-center gap-2"
                    >
                      {Icon && <Icon className={`w-3 h-3 ${link.color}`} />}
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* API Status Banner */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">All systems operational</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">99.9% uptime SLA</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">Base URL:</span>
              <code className="text-golf-green bg-gray-800 px-2 py-1 rounded text-xs">
                api.golfphysics.io
              </code>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Golf Physics. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with real physics. Validated against TrackMan.
          </p>
        </div>
      </div>
    </footer>
  )
}
