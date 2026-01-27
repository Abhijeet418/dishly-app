'use client'

import { useEffect, useState, useRef } from 'react'
import { useRecipeStore } from '@/store/recipeStore'
import RecipeCard from '@/components/RecipeCard'
import { Loader } from 'lucide-react'

export default function FeaturedRecipes() {
  const { recipes, getPublicRecipes, isLoading } = useRecipeStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitialized) {
          getPublicRecipes(0, 6)
          setIsInitialized(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isInitialized, getPublicRecipes])

  return (
    <section className="py-20 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Recipes</h2>
          <p className="text-lg text-gray-600">Discover delicious recipes from our community</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes
              .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
              .slice(0, 6)
              .map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
        )}
      </div>
    </section>
  )
}
