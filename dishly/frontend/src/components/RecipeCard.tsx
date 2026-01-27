'use client'

import { useState, useEffect } from 'react'
import { RecipeList } from '@/types'
import Link from 'next/link'
import { Clock, Users, Flame, Trash2, Edit, Heart } from 'lucide-react'
import Image from 'next/image'
import { recipeService, collectionService } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const getLikedRecipes = () => {
  if (typeof window === 'undefined') return {}
  return JSON.parse(localStorage.getItem('likedRecipes') || '{}')
}

interface RecipeCardProps {
  recipe: RecipeList
  onDelete?: (id: string) => void
  showDeleteButton?: boolean
  showEditButton?: boolean
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-100 text-green-800'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800'
    case 'HARD':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function RecipeCard({ recipe, onDelete, showDeleteButton, showEditButton }: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(recipe.likeCount || 0)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  useEffect(() => {
    const likedRecipes = getLikedRecipes()
    setIsLiked(!!likedRecipes[recipe.id])
    
    // Check if recipe is in user's "Liked Recipes" collection
    if (isAuthenticated) {
      checkIfLiked()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id, isAuthenticated])

  const checkIfLiked = async () => {
    try {
      const collections = await collectionService.getCollections()
      const likedCollection = collections.find((c) => c.name === 'Liked Recipes')
      
      if (likedCollection) {
        const recipes = await collectionService.getCollectionRecipes(likedCollection.id)
        const isInCollection = recipes.some((r) => r.id === recipe.id)
        setIsLiked(isInCollection)
      } else {
        setIsLiked(false)
      }
    } catch (error) {
      console.error('Failed to check if recipe is liked:', error)
      setIsLiked(false)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-semibold">Register to Like Recipes</p>
            <p className="text-sm text-gray-600 mt-1">Create an account to save your favorite recipes.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                window.location.href = '/register'
                toast.dismiss(t.id)
              }}
              className="px-4 py-2 bg-dishly-primary text-white rounded-lg text-sm font-semibold hover:bg-dishly-primary/90"
            >
              Register Now
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
      })
      return
    }

    setIsLoadingLike(true)
    try {
      const newIsLiked = !isLiked
      
      if (newIsLiked) {
        await recipeService.likeRecipe(recipe.id)
        setLikeCount(likeCount + 1)
        setIsLiked(true)
        
        // Add to "Liked Recipes" collection
        await addToLikedCollection(recipe.id)
      } else {
        await recipeService.unlikeRecipe(recipe.id)
        setLikeCount(likeCount - 1)
        setIsLiked(false)
        
        // Remove from "Liked Recipes" collection
        await removeFromLikedCollection(recipe.id)
      }
    } catch (error) {
      toast.error('Failed to update like')
      console.error('Like error:', error)
    } finally {
      setIsLoadingLike(false)
    }
  }

  const addToLikedCollection = async (recipeId: string) => {
    try {
      const collections = await collectionService.getCollections()
      let likedCollection = collections.find((c) => c.name === 'Liked Recipes')
      
      if (!likedCollection) {
        // Create "Liked Recipes" collection if it doesn't exist
        likedCollection = await collectionService.createCollection({ name: 'Liked Recipes' })
      }
      
      // Add recipe to the collection
      await collectionService.addRecipeToCollection(likedCollection.id, recipeId)
    } catch (error) {
      console.error('Failed to add to liked collection:', error)
    }
  }

  const removeFromLikedCollection = async (recipeId: string) => {
    try {
      const collections = await collectionService.getCollections()
      const likedCollection = collections.find((c) => c.name === 'Liked Recipes')
      
      if (likedCollection) {
        // Remove recipe from the collection
        await collectionService.removeRecipeFromCollection(likedCollection.id, recipeId)
      }
    } catch (error) {
      console.error('Failed to remove from liked collection:', error)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete && window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete(recipe.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/recipes/${recipe.id}/edit`
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="group card overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {recipe.imageUrls && recipe.imageUrls[0] ? (
            <Image
              src={recipe.imageUrls[0]}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dishly-primary to-dishly-accent flex items-center justify-center">
              <Flame className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            {showEditButton && (
              <button
                onClick={handleEdit}
                className="bg-dishly-primary hover:bg-dishly-primary/90 text-white rounded-full p-2 shadow-md transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {showDeleteButton && onDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-dishly-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Username */}
          <div className="mb-3 text-sm text-gray-600">
            <span className="font-semibold text-dishly-primary">By {recipe.username || 'Unknown'}</span>
          </div>

          {/* Categories */}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.categories.slice(0, 2).map((category) => (
                <span key={category} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold">
                  {category.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4 text-dishly-primary" />
              <span className="text-sm">{totalTime}m</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-4 h-4 text-dishly-primary" />
              <span className="text-sm">{recipe.servings}</span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <button
                onClick={handleLike}
                disabled={isLoadingLike}
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: isLiked ? '#fee2e2' : '#f3f4f6',
                }}
              >
                <Heart
                  className="w-5 h-5 transition-all"
                  style={{
                    color: isLiked ? '#ef4444' : '#d1d5db',
                    fill: isLiked ? '#ef4444' : 'none',
                  }}
                />
                <span className={`text-sm font-semibold ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                  {likeCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
