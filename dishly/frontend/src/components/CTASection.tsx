'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-dishly-primary to-dishly-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Start Cooking?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of food lovers creating and sharing recipes on Dishly. Build your culinary collection today.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center space-x-2 bg-white text-dishly-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
