'use client'

import { useEffect, useState } from 'react'
import RecipeCard from '@/components/RecipeCard'
import { Loader, Heart } from 'lucide-react'
import { recipeService }  from '@/services/api'
import { RecipeList } from '@/types'

export default function TrendingRecipes() {
  const [recipes, setRecipes] = useState<RecipeList[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrendingRecipes()
  }, [])

  const fetchTrendingRecipes = async () => {
    try {
      setIsLoading(true)
      const response = await recipeService.getPublicRecipes(0, 20)
      // Handle paginated response
      let recipeList = response.content || response || []
      // Sort by likeCount and take top 3
      recipeList = Array.isArray(recipeList) 
        ? recipeList
            .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
            .slice(0, 3)
        : []
      setRecipes(recipeList)
    } catch (error) {
      console.error('Failed to fetch trending recipes:', error)
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              Trending Now
            </h2>
            <p className="text-lg text-gray-600">Most loved recipes from our community</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            Trending Now
          </h2>
          <p className="text-lg text-gray-600">Most loved recipes from our community</p>
        </div>

        {recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No trending recipes yet</p>
          </div>
        )}
      </div>
    </section>
  )
}
