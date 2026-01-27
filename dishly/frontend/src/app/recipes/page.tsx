'use client'

import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/store/recipeStore'
import { useAuthStore } from '@/store/authStore'
import RecipeCard from '@/components/RecipeCard'
import { Search, Loader, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RecipesPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { recipes, getPublicRecipes, isLoading } = useRecipeStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    getPublicRecipes(page, 20, search, category)
  }, [page, search, category, getPublicRecipes])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  const handleCategoryChange = (cat: string) => {
    const categoryValue = cat === 'All' ? '' : cat
    setCategory(categoryValue)
    setPage(0)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-dishly-primary to-dishly-accent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Browse Recipes</h1>
          <p className="text-white/90 text-lg">Discover amazing recipes from our community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes by title..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Create Recipe Button */}
            {isAuthenticated && (
              <button
                onClick={() => router.push('/recipes/create')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Recipe</span>
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Italian', 'Asian', 'Dessert', 'Vegetarian', 'Mexican', 'French', 'Indian', 'Mediterranean', 'American', 'Thai', 'Chinese', 'Seafood', 'Breakfast', 'Lunch', 'Dinner'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  (cat === 'All' && category === '') || category === cat
                    ? 'bg-dishly-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No recipes found</p>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {recipes.length > 0 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={recipes.length < 20}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
