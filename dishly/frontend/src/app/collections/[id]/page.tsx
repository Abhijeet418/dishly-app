'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { collectionService, recipeService } from '@/services/api'
import { RecipeCollection } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft, Trash2, Loader } from 'lucide-react'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const collectionId = params.id as string
  const [collection, setCollection] = useState<RecipeCollection | null>(null)
  const [recipes, setRecipes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCollection = async () => {
    setIsLoading(true)
    try {
      const data = await collectionService.getCollections()
      const found = data.find((c) => c.id === collectionId)
      if (found) {
        setCollection(found)
        // Fetch all recipes in this collection
        if (found.recipeIds && found.recipeIds.length > 0) {
          try {
            const collectionRecipes = await collectionService.getCollectionRecipes(collectionId)
            setRecipes(collectionRecipes)
          } catch (error) {
            // Fallback: filter user recipes if dedicated endpoint not available
            console.warn('Collection recipes endpoint not available, using fallback')
            const allRecipes = await recipeService.getUserRecipes()
            const recipeData = allRecipes.filter((recipe) => found.recipeIds.includes(recipe.id))
            setRecipes(recipeData)
          }
        }
      } else {
        toast.error('Collection not found')
        router.push('/collections')
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
      toast.error('Failed to load collection')
      router.push('/collections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCollection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router, collectionId])

  const handleDeleteCollection = async () => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return

    setIsDeleting(true)
    try {
      await collectionService.deleteCollection(collectionId)
      toast.success('Collection deleted')
      router.push('/collections')
    } catch (error) {
      toast.error('Failed to delete collection')
      setIsDeleting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection not found</h1>
          <Link href="/collections" className="text-dishly-primary hover:underline">
            Back to collections
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-dishly-primary hover:text-dishly-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{collection.name}</h1>
              <p className="text-gray-600">{collection.recipeCount} recipes in this collection</p>
            </div>
            {collection.name !== 'Liked Recipes' && (
              <button
                onClick={handleDeleteCollection}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-700 flex items-center space-x-2"
              >
                {isDeleting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete Collection</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {recipes && recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No recipes yet</h2>
            <p className="text-gray-600">Add recipes to this collection from the recipe detail pages</p>
          </div>
        )}
      </div>
    </div>
  )
}
