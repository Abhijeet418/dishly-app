'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { collectionService } from '@/services/api'
import { RecipeCollection } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Trash2, Loader } from 'lucide-react'

export default function CollectionsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [collections, setCollections] = useState<RecipeCollection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchCollections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router])

  const fetchCollections = async () => {
    setIsLoading(true)
    try {
      const data = await collectionService.getCollections()
      setCollections(data)
    } catch (error) {
      toast.error('Failed to load collections')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name')
      return
    }

    try {
      const newCollection = await collectionService.createCollection({
        name: newCollectionName,
      })
      setCollections([...collections, newCollection])
      setNewCollectionName('')
      setShowModal(false)
      toast.success('Collection created!')
    } catch (error) {
      toast.error('Failed to create collection')
    }
  }

  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return

    try {
      await collectionService.deleteCollection(id)
      setCollections(collections.filter((c) => c.id !== id))
      toast.success('Collection deleted')
    } catch (error) {
      toast.error('Failed to delete collection')
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
            <h1 className="text-4xl font-bold text-gray-900">My Collections</h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Collection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-dishly-primary animate-spin" />
          </div>
        ) : collections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <div key={collection.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{collection.name}</h3>
                  {collection.name !== 'Liked Recipes' ? (
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete collection"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  ) : (
                    <div title="The Liked Recipes collection cannot be deleted" className="p-2 text-gray-300 cursor-not-allowed">
                      <Trash2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{collection.recipeCount} recipes</p>
                <button 
                  onClick={() => router.push(`/collections/${collection.id}`)}
                  className="btn-primary w-full text-center"
                >
                  View Collection
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No collections yet</h2>
            <p className="text-gray-600 mb-6">Create your first collection to organize your recipes</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Collection</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Collection</h2>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name"
              className="input-field mb-6"
              autoFocus
            />
            <div className="flex gap-4">
              <button
                onClick={handleCreateCollection}
                className="btn-primary flex-1"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setNewCollectionName('')
                }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
