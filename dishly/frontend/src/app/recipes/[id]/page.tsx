'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRecipeStore } from '@/store/recipeStore'
import { useAuthStore } from '@/store/authStore'
import { Clock, Users, Flame, Share2, Edit, Trash2, Loader, Plus, X, Heart } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share'
import { collectionService, recipeService } from '@/services/api'
import { RecipeCollection } from '@/types'

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.id as string
  const { currentRecipe, getRecipeById, deleteRecipe, isLoading } = useRecipeStore()
  const { isAuthenticated, user } = useAuthStore()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [collections, setCollections] = useState<RecipeCollection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const [isSavingCollections, setIsSavingCollections] = useState(false)

  useEffect(() => {
    if (recipeId) {
      getRecipeById(recipeId)
    }
  }, [recipeId, getRecipeById])

  useEffect(() => {
    if (currentRecipe) {
      setLikeCount(currentRecipe.likeCount || 0)
      
      // Check if recipe is in user's "Liked Recipes" collection
      if (isAuthenticated) {
        checkIfLiked()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRecipe, recipeId, isAuthenticated])

  const checkIfLiked = async () => {
    try {
      const collections = await collectionService.getCollections()
      const likedCollection = collections.find((c) => c.name === 'Liked Recipes')
      
      if (likedCollection) {
        const recipes = await collectionService.getCollectionRecipes(likedCollection.id)
        const isInCollection = recipes.some((r) => r.id === recipeId)
        setIsLiked(isInCollection)
      } else {
        setIsLiked(false)
      }
    } catch (error) {
      console.error('Failed to check if recipe is liked:', error)
      setIsLiked(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && showCollectionModal) {
      loadCollections()
    }
  }, [isAuthenticated, showCollectionModal])

  const loadCollections = async () => {
    try {
      setIsLoadingCollections(true)
      const data = await collectionService.getCollections()
      setCollections(data)
    } catch (error) {
      toast.error('Failed to load collections')
    } finally {
      setIsLoadingCollections(false)
    }
  }

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleSaveCollections = async () => {
    try {
      setIsSavingCollections(true)
      // Add recipe to selected collections
      for (const collectionId of selectedCollections) {
        await collectionService.addRecipeToCollection(collectionId, recipeId)
      }
      toast.success('Recipe added to collections!')
      setShowCollectionModal(false)
      setSelectedCollections([])
    } catch (error) {
      toast.error('Failed to save collections')
    } finally {
      setIsSavingCollections(false)
    }
  }

  const handleRate = async () => {
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
        // Like the recipe
        await recipeService.likeRecipe(recipeId)
        setLikeCount(likeCount + 1)
        setIsLiked(true)
        
        // Add to "Liked Recipes" collection
        await addToLikedCollection()
        toast.success('Added to Liked Recipes!')
      } else {
        // Unlike the recipe
        await recipeService.unlikeRecipe(recipeId)
        setLikeCount(likeCount - 1)
        setIsLiked(false)
        
        // Remove from "Liked Recipes" collection
        await removeFromLikedCollection()
        toast.success('Removed from Liked Recipes!')
      }
    } catch (error) {
      toast.error('Failed to update like')
      console.error('Like error:', error)
    } finally {
      setIsLoadingLike(false)
    }
  }

  const addToLikedCollection = async () => {
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

  const removeFromLikedCollection = async () => {
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

  const handleShare = async () => {
    setShowShareModal(true)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return

    setIsDeleting(true)
    try {
      await deleteRecipe(recipeId)
      toast.success('Recipe deleted successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to delete recipe')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
      </div>
    )
  }

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
          <Link href="/recipes" className="text-dishly-primary hover:underline mt-4 inline-block">
            Back to recipes
          </Link>
        </div>
      </div>
    )
  }

  const totalTime = currentRecipe.prepTimeMinutes + currentRecipe.cookTimeMinutes
  const isOwner = isAuthenticated && user?.id === currentRecipe.id

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      {currentRecipe.imageUrls && currentRecipe.imageUrls[0] && (
        <div className="relative h-96 bg-gray-200">
          <Image
            src={currentRecipe.imageUrls[0]}
            alt={currentRecipe.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Meta */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{currentRecipe.title}</h1>
              {currentRecipe.description && (
                <p className="text-xl text-gray-600">{currentRecipe.description}</p>
              )}
              {/* Username */}
              <div className="mt-4">
                <p className="text-lg text-gray-600">
                  By <span className="font-semibold text-dishly-primary">{currentRecipe.username || 'Recipe Bot'}</span>
                </p>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/recipes/${recipeId}/edit`}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-primary bg-red-600 hover:bg-red-700 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Heart Like Button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => handleRate()}
              disabled={isLoadingLike}
              className="flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50"
              style={{
                backgroundColor: isLiked ? '#fee2e2' : '#f3f4f6',
              }}
            >
              <Heart
                className="w-6 h-6 transition-all"
                style={{
                  color: isLiked ? '#ef4444' : '#d1d5db',
                  fill: isLiked ? '#ef4444' : 'none',
                }}
              />
              <span className={`text-lg font-semibold ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </span>
            </button>
          </div>
        </div>

        {/* Meta Info Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 mb-12 p-4 sm:p-6 bg-gray-50 rounded-2xl">
          <div className="text-center">
            <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-dishly-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalTime}m</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Time</p>
          </div>
          <div className="text-center">
            <Users className="w-6 sm:w-8 h-6 sm:h-8 text-dishly-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{currentRecipe.servings}</p>
            <p className="text-xs sm:text-sm text-gray-600">Servings</p>
          </div>
          <div className="text-center">
            <Flame className="w-6 sm:w-8 h-6 sm:h-8 text-dishly-primary mx-auto mb-1 sm:mb-2" />
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{currentRecipe.difficulty}</p>
            <p className="text-xs sm:text-sm text-gray-600">Difficulty</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-12">
          {/* Categories and Tags */}
          <div className="mb-8">
            {currentRecipe.categories && currentRecipe.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.categories.map((category) => (
                    <span
                      key={category}
                      className="px-4 py-2 bg-dishly-primary text-white rounded-full text-sm font-semibold"
                    >
                      {category.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentRecipe.tags && currentRecipe.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRecipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-dishly-accent text-white rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients in 2 Columns */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {currentRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-dishly-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{ingredient.name}</p>
                    <p className="text-sm text-gray-600">
                      {ingredient.quantity} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Instructions</h2>
          <div className="space-y-4">
            {currentRecipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gradient-to-r from-dishly-primary/10 to-dishly-accent/10 rounded-xl">
                <div className="min-w-fit">
                  <div className="w-12 h-12 rounded-full bg-dishly-primary text-white flex items-center justify-center font-bold">
                    {instruction.stepNumber}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-lg text-gray-900 leading-relaxed">{instruction.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share and Collections Button */}
        <div className="text-center flex justify-center gap-4">
          <button onClick={handleShare} className="btn-secondary flex items-center justify-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Recipe</span>
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setShowCollectionModal(true)}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add to Collection</span>
            </button>
          )}
        </div>

        {/* Collections Modal */}
        {showCollectionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add to Collection</h3>
                <button
                  onClick={() => {
                    setShowCollectionModal(false)
                    setSelectedCollections([])
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {isLoadingCollections ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 text-dishly-primary animate-spin" />
                </div>
              ) : collections.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {collections.map((collection) => (
                      <label
                        key={collection.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCollections.includes(collection.id)}
                          onChange={() => handleCollectionToggle(collection.id)}
                          className="w-4 h-4 text-dishly-primary rounded border-gray-300 focus:ring-dishly-primary"
                        />
                        <span className="ml-3 font-medium text-gray-900">{collection.name}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowCollectionModal(false)
                        setSelectedCollections([])
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCollections}
                      disabled={isSavingCollections || selectedCollections.length === 0}
                      className="flex-1 px-4 py-2 bg-dishly-primary text-white rounded-lg font-semibold hover:bg-dishly-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSavingCollections ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add ({selectedCollections.length})
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No collections yet</p>
                  <Link
                    href="/collections"
                    className="text-dishly-primary hover:underline font-semibold"
                  >
                    Create a collection
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && currentRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Share Recipe</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <p className="text-gray-600 text-center mb-6">Share &quot;{currentRecipe.title}&quot; with your friends</p>

              <div className="space-y-3">
                <FacebookShareButton
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/recipes/${recipeId}`}
                  hashtag={`#${currentRecipe.title?.replace(/\s+/g, '')}`}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                    <FacebookIcon size={32} round />
                    <span className="font-semibold text-gray-900">Share on Facebook</span>
                  </div>
                </FacebookShareButton>

                <TwitterShareButton
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/recipes/${recipeId}`}
                  title={`Check out this recipe: ${currentRecipe.title}`}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer">
                    <TwitterIcon size={32} round />
                    <span className="font-semibold text-gray-900">Share on Twitter</span>
                  </div>
                </TwitterShareButton>

                <WhatsappShareButton
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/recipes/${recipeId}`}
                  title={`Check out this recipe: ${currentRecipe.title}`}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                    <WhatsappIcon size={32} round />
                    <span className="font-semibold text-gray-900">Share on WhatsApp</span>
                  </div>
                </WhatsappShareButton>

                <EmailShareButton
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/recipes/${recipeId}`}
                  subject={`Check out this recipe: ${currentRecipe.title}`}
                  body={`I found this amazing recipe: ${currentRecipe.title}. Check it out!`}
                  className="w-full"
                >
                  <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <EmailIcon size={32} round />
                    <span className="font-semibold text-gray-900">Share via Email</span>
                  </div>
                </EmailShareButton>

                <button
                  onClick={async () => {
                    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/recipes/${recipeId}`
                    try {
                      await navigator.clipboard.writeText(shareUrl)
                      toast.success('Recipe link copied to clipboard!')
                      setShowShareModal(false)
                    } catch (error) {
                      toast.error('Failed to copy link')
                    }
                  }}
                  className="w-full p-3 bg-dishly-primary hover:bg-dishly-primary/90 text-white rounded-lg font-semibold transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
