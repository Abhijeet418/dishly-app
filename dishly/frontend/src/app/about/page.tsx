'use client'

import Link from 'next/link'
import { Users, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-dishly-primary/10 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">About Dishly</h1>
          <p className="text-xl text-gray-600 mb-8">
            Making Indian and global recipes accessible to every food lover.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-4">
            Dishly was founded in 2024 in Bangalore with a mission to celebrate the rich culinary heritage of India while making global cuisine accessible to home cooks everywhere.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            From traditional South Indian dosas to fusion recipes blending Indian spices with world cuisines, Dishly is a platform where millions of food enthusiasts share their culinary creations.
          </p>
          <p className="text-lg text-gray-600">
            We believe every kitchen has a story, and every recipe deserves to be shared. Today, Dishly is the fastest-growing recipe platform in India with a thriving community across India and the diaspora.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <Zap className="w-12 h-12 text-dishly-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to celebrate Indian cuisine while bridging culinary traditions across cultures.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <Users className="w-12 h-12 text-dishly-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We foster a vibrant community where home cooks, chefs, and food lovers share their passion for food.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-br from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
              <Globe className="w-12 h-12 text-dishly-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inclusivity</h3>
              <p className="text-gray-600">
                We celebrate the diversity of Indian regional cuisines and global recipes from around the world.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 py-16 border-y border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-dishly-primary mb-2">5K+</div>
            <p className="text-gray-600">Indian & Global Recipes</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-dishly-primary mb-2">50K+</div>
            <p className="text-gray-600">Active Users in India</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-dishly-primary mb-2">100K+</div>
            <p className="text-gray-600">Likes & Collections</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-dishly-primary mb-2">15+</div>
            <p className="text-gray-600">Indian States Covered</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Cooking?</h2>
          <Link href="/register" className="btn-primary inline-block">
            Join Our Community
          </Link>
        </div>
      </div>
    </div>
  )
}
