'use client'

import Link from 'next/link'
import { ArrowRight, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { recipeService } from '@/services/api'

export default function HeroSection() {
  const [stats, setStats] = useState({
    recipeCount: 0,
    userCount: 0,
    likeCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      // Fetch public recipes to count them
      const response = await recipeService.getPublicRecipes(0, 1)
      const recipeCount = response.totalElements || response.content?.length || 0
      
      // Fetch all public recipes to sum likes
      const allRecipes = await recipeService.getPublicRecipes(0, 1000)
      const recipeList = allRecipes.content || []
      const totalLikes = recipeList.reduce((sum: number, recipe: any) => sum + (recipe.likeCount || 0), 0)
      
      setStats({
        recipeCount,
        userCount: Math.floor(recipeCount * 0.4), // Estimate: ~40% of recipe count
        likeCount: totalLikes,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-white via-red-50 to-white min-h-screen flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-dishly-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-dishly-accent opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Create and Share
                <br />
                <span className="gradient-text">Amazing Recipes</span>
              </h1>
              <p className="text-xl text-gray-600">
                Dishly is your modern recipe manager. Create, organize, and share your culinary creations with the world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/recipes" className="btn-primary inline-flex items-center justify-center space-x-2">
                <span>Explore Recipes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register" className="btn-outline inline-flex items-center justify-center space-x-2">
                <span>Get Started</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-dishly-primary">
                  {isLoading ? '...' : stats.recipeCount.toLocaleString()}
                </div>
                <p className="text-gray-600">Recipes</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-dishly-primary">
                  {isLoading ? '...' : Math.round(stats.userCount).toLocaleString()}+
                </div>
                <p className="text-gray-600">Users</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-dishly-primary">
                  {isLoading ? '...' : stats.likeCount.toLocaleString()}
                </div>
                <p className="text-gray-600">Likes</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <div className="bg-gradient-to-br from-dishly-primary to-dishly-accent rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-12 flex items-center justify-center">
                  <Utensils className="w-32 h-32 text-dishly-primary opacity-10" />
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 bg-dishly-accent rounded-full p-4 shadow-lg"
              >
                <div className="text-white font-bold text-sm">⭐ 4.8</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
