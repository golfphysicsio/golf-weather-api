import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Target, Gamepad2, Building2 } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path
  const isProductActive = () => ['/professional', '/gaming', '/enterprise'].includes(location.pathname)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">⛳</span>
              <span className="text-xl font-bold text-gray-900">Golf Physics</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                onBlur={() => setTimeout(() => setProductsOpen(false), 150)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isProductActive()
                    ? 'text-golf-green'
                    : 'text-gray-600 hover:text-golf-green'
                }`}
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    to="/professional"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-pro-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-pro-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Professional API</p>
                      <p className="text-xs text-gray-500">Tour-accurate physics for training</p>
                    </div>
                  </Link>
                  <Link
                    to="/gaming"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gaming-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-5 h-5 text-gaming-orange" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Gaming API</p>
                      <p className="text-xs text-gray-500">Extreme weather for entertainment</p>
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to="/enterprise"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setProductsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-golf-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-golf-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Enterprise</p>
                      <p className="text-xs text-gray-500">Launch monitor integration</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/science"
              className={`text-sm font-medium transition-colors ${
                isActive('/science')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Science
            </Link>

            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/docs"
              className={`text-sm font-medium transition-colors ${
                isActive('/docs')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Docs
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              About
            </Link>

            <Link to="/contact" className="btn-primary text-sm py-2 px-4">
              Get API Access
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-1">
            {/* Products Section */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">
              Products
            </p>
            <Link
              to="/professional"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-2 py-3 rounded-lg ${
                isActive('/professional')
                  ? 'bg-pro-blue/10 text-pro-blue'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Target className="w-5 h-5" />
              <div>
                <p className="font-medium">Professional API</p>
                <p className="text-xs text-gray-500">Tour-accurate physics</p>
              </div>
            </Link>
            <Link
              to="/gaming"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-2 py-3 rounded-lg ${
                isActive('/gaming')
                  ? 'bg-gaming-orange/10 text-gaming-orange'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <div>
                <p className="font-medium">Gaming API</p>
                <p className="text-xs text-gray-500">Extreme entertainment</p>
              </div>
            </Link>
            <Link
              to="/enterprise"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-2 py-3 rounded-lg ${
                isActive('/enterprise')
                  ? 'bg-golf-green/10 text-golf-green'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <div>
                <p className="font-medium">Enterprise</p>
                <p className="text-xs text-gray-500">Launch monitor integration</p>
              </div>
            </Link>

            <div className="border-t my-2"></div>

            <Link
              to="/science"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-3 font-medium ${
                isActive('/science')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Science
            </Link>

            <Link
              to="/pricing"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-3 font-medium ${
                isActive('/pricing')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Pricing
            </Link>

            <Link
              to="/docs"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-3 font-medium ${
                isActive('/docs')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              Documentation
            </Link>

            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-2 py-3 font-medium ${
                isActive('/about')
                  ? 'text-golf-green'
                  : 'text-gray-600 hover:text-golf-green'
              }`}
            >
              About
            </Link>

            <div className="pt-4">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-sm py-3 px-4 block text-center"
              >
                Get API Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
