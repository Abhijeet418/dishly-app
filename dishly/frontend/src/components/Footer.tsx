'use client'

import Link from 'next/link'
import { ChefHat, Github, Twitter, Facebook } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { isAuthenticated } = useAuthStore()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-6 h-6 text-dishly-primary" />
              <span className="text-xl font-bold text-white">Dishly</span>
            </div>
            <p className="text-sm text-gray-400">
              Create, share, and organize your favorite recipes with Dishly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-dishly-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-dishly-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-dishly-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recipes" className="hover:text-dishly-primary transition-colors">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link href={isAuthenticated ? '/recipes/create' : '/register'} className="hover:text-dishly-primary transition-colors">
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link href={isAuthenticated ? '/collections' : '/register'} className="hover:text-dishly-primary transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-dishly-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-dishly-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-dishly-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-dishly-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-dishly-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Dishly. All rights reserved.</p>
          <p>Made with ❤️ for food lovers everywhere</p>
        </div>
      </div>
    </footer>
  )
}
