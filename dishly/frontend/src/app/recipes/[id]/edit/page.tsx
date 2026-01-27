'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useRecipeStore } from '@/store/recipeStore'
import toast from 'react-hot-toast'
import { Plus, Trash2, Loader, Upload } from 'lucide-react'
import { Instruction } from '@/types'
import { uploadToCloudinary } from '@/lib/cloudinary'

export default function EditRecipePage() {
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string
  const { isAuthenticated, isInitialized } = useAuthStore()
  const { currentRecipe, getRecipeById, updateRecipe, isLoading } = useRecipeStore()
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    servings: '',
    difficulty: 'EASY' as 'EASY' | 'MEDIUM' | 'HARD',
    isPublic: false,
    imageUrls: [''],
    ingredients: [{ name: '', quantity: '', unit: '', order: 0 }] as any[],
    instructions: [{ stepNumber: 1, description: '' }] as Instruction[],
    categories: [''],
    tags: [''],
  })

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login')
    } else if (isInitialized && recipeId) {
      getRecipeById(recipeId)
    }
  }, [isInitialized, isAuthenticated, recipeId, router, getRecipeById])

  useEffect(() => {
    if (currentRecipe) {
      // Populate form with recipe data
      setFormData({
        title: currentRecipe.title,
        description: currentRecipe.description || '',
        prepTimeMinutes: currentRecipe.prepTimeMinutes.toString(),
        cookTimeMinutes: currentRecipe.cookTimeMinutes.toString(),
        servings: currentRecipe.servings.toString(),
        difficulty: currentRecipe.difficulty,
        isPublic: currentRecipe.isPublic,
        imageUrls: currentRecipe.imageUrls || [''],
        ingredients: currentRecipe.ingredients || [],
        instructions: currentRecipe.instructions || [],
        categories: currentRecipe.categories || [''],
        tags: currentRecipe.tags || [''],
      })
    }
  }, [currentRecipe])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, index: number, subfield: string, value: any) => {
    setFormData((prev) => {
      const fieldValue = prev[field as keyof typeof formData]
      if (Array.isArray(fieldValue)) {
        const updated = [...fieldValue] as any[]
        updated[index][subfield] = value
        return { ...prev, [field]: updated }
      }
      return prev
    })
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          name: '',
          quantity: '',
          unit: '',
          order: prev.ingredients.length,
        },
      ],
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        {
          stepNumber: prev.instructions.length + 1,
          description: '',
        },
      ],
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter a recipe title')
      return
    }

    if (formData.ingredients.some((ing) => !ing.name.trim())) {
      toast.error('Please fill in all ingredient names')
      return
    }

    if (formData.instructions.some((inst) => !inst.description.trim())) {
      toast.error('Please fill in all instruction descriptions')
      return
    }

    try {
      setIsUpdating(true)
      const recipeData = {
        ...formData,
        prepTimeMinutes: parseInt(formData.prepTimeMinutes as any) || 0,
        cookTimeMinutes: parseInt(formData.cookTimeMinutes as any) || 0,
        servings: parseInt(formData.servings as any) || 1,
        imageUrls: formData.imageUrls.filter((url) => url.trim()),
        categories: formData.categories.filter((cat) => cat.trim()),
        tags: formData.tags.filter((tag) => tag.trim()),
        ingredients: formData.ingredients.map((ing: any) => ({
          ...ing,
          quantity: typeof ing.quantity === 'string' ? (parseFloat(ing.quantity) || 0) : ing.quantity,
        })),
      }

      await updateRecipe(recipeId, recipeData)
      toast.success('Recipe updated successfully!')
      router.push(`/recipes/${recipeId}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update recipe'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
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

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Details</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter recipe title"
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your recipe"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Time and Servings */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prepTimeMinutes}
                    onChange={(e) => handleInputChange('prepTimeMinutes', e.target.value)}
                    placeholder="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cookTimeMinutes}
                    onChange={(e) => handleInputChange('cookTimeMinutes', e.target.value)}
                    placeholder="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Servings *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) => handleInputChange('servings', e.target.value)}
                    placeholder="1"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Difficulty and Public */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="input-field"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className="flex items-end gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="w-5 h-5 text-dishly-primary rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700">
                    Make this recipe public
                  </label>
                </div>
              </div>

              {/* Recipe Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipe Image (Optional)
                </label>
                <div className="space-y-4">
                  {formData.imageUrls[0] && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.imageUrls[0]}
                        alt="Recipe preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrls: [''] }))}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {!formData.imageUrls[0] && (
                    <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-dishly-primary transition-colors bg-gray-50">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {isUploadingImage ? 'Uploading...' : 'Click to upload image'}
                        </span>
                        <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Image must be less than 10MB')
                            return
                          }

                          try {
                            setIsUploadingImage(true)
                            const url = await uploadToCloudinary(file)
                            setFormData((prev) => ({ ...prev, imageUrls: [url] }))
                            toast.success('Image uploaded successfully!')
                          } catch (error) {
                            console.error('Upload error:', error)
                            toast.error('Failed to upload image')
                          } finally {
                            setIsUploadingImage(false)
                          }
                        }}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categories
                </label>
                <div className="space-y-4">
                  {/* Predefined Categories */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Click to select:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Dessert', 'Breakfast', 'Lunch', 'Dinner', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Italian', 'Asian', 'Mexican', 'Seafood', 'Meat'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (!formData.categories.includes(cat)) {
                              setFormData((prev) => ({
                                ...prev,
                                categories: [...prev.categories.filter((c) => c !== ''), cat],
                              }))
                            }
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                            formData.categories.includes(cat)
                              ? 'bg-dishly-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Categories */}
                  {formData.categories.filter((c) => c !== '').length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Selected categories:</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.categories
                          .filter((c) => c !== '')
                          .map((category, index) => (
                            <div
                              key={index}
                              className="px-3 py-1 bg-dishly-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                            >
                              {category}
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    categories: prev.categories.filter((_, i) => i !== index),
                                  }))
                                }
                                className="hover:opacity-80 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Category Input */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Or type a custom category:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., Low-Carb, Quick Meals"
                        className="input-field flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value && !formData.categories.includes(value)) {
                              setFormData((prev) => ({
                                ...prev,
                                categories: [...prev.categories.filter((c) => c !== ''), value],
                              }))
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                          const value = input.value.trim()
                          if (value && !formData.categories.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              categories: [...prev.categories.filter((c) => c !== ''), value],
                            }))
                            input.value = ''
                          }
                        }}
                        className="btn-outline px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const updated = [...formData.tags]
                          updated[index] = e.target.value
                          setFormData((prev) => ({ ...prev, tags: updated }))
                        }}
                        placeholder="e.g., spicy, quick, healthy"
                        className="input-field"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((_, i) => i !== index),
                            }))
                          }
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, tags: [...prev.tags, ''] }))}
                    className="flex items-center gap-2 text-dishly-primary hover:text-dishly-primary/80 transition-colors text-sm font-semibold mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <div className="space-y-4 mb-4">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) => handleArrayChange('ingredients', index, 'name', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={ingredient.quantity || ''}
                      onChange={(e) => handleArrayChange('ingredients', index, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                      className="input-field"
                      step="0.1"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleArrayChange('ingredients', index, 'unit', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="btn-outline flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Ingredient</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
            <div className="space-y-4 mb-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">Step {instruction.stepNumber}</span>
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    placeholder="Describe this step"
                    value={instruction.description}
                    onChange={(e) => handleArrayChange('instructions', index, 'description', e.target.value)}
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="btn-outline flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Step</span>
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isUpdating || isLoading}
              className="btn-primary flex items-center justify-center space-x-2 flex-1 disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isUpdating ? 'Updating...' : 'Update Recipe'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
