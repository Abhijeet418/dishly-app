'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Small delay to ensure page has loaded
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Settings</h3>
            <p className="text-sm text-gray-300">
              We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By
              clicking &quot;Accept,&quot; you consent to our use of cookies. Check our{' '}
              <Link href="/privacy" className="text-dishly-primary hover:underline">
                Privacy Policy
              </Link>
              {' '}for more details.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors font-medium text-sm"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-dishly-primary hover:bg-dishly-primary/90 rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
            >
              Accept All
            </button>
            <button
              onClick={handleReject}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
