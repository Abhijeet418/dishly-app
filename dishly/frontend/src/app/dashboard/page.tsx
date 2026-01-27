'use client'

import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/store/recipeStore'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { Plus, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const { userRecipes, getUserRecipes, deleteRecipe, isLoading } = useRecipeStore()
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    getUserRecipes()
  }, [isAuthenticated, router, getUserRecipes])

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      setIsDeleting(true)
      if (isDeleting){console.log("deleting")}
      await deleteRecipe(recipeId)
      toast.success('Recipe deleted successfully')
      await getUserRecipes()
    } catch (error) {
      toast.error('Failed to delete recipe')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Recipes</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
            </div>
            <Link href="/recipes/create" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Recipe</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
          </div>
        ) : userRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                showDeleteButton={true}
                showEditButton={true}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No recipes yet</h2>
            <p className="text-gray-600 mb-6">Create your first recipe to get started</p>
            <Link href="/recipes/create" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create First Recipe</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
