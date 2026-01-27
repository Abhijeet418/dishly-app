import { create } from 'zustand'
import { RecipeList, Recipe } from '@/types'
import { recipeService } from '@/services/api'

interface RecipeStore {
  recipes: RecipeList[]
  userRecipes: RecipeList[]
  currentRecipe: Recipe | null
  isLoading: boolean
  error: string | null

  getPublicRecipes: (page?: number, size?: number, search?: string, category?: string) => Promise<void>
  searchPublicRecipes: (searchTerm?: string, category?: string, page?: number, size?: number) => Promise<void>
  getUserRecipes: (search?: string, category?: string, tag?: string) => Promise<void>
  getRecipeById: (id: string) => Promise<void>
  createRecipe: (data: any) => Promise<Recipe>
  updateRecipe: (id: string, data: any) => Promise<Recipe>
  deleteRecipe: (id: string) => Promise<void>
  rateRecipe: (id: string, rating: number) => Promise<void>
  toggleVisibility: (id: string) => Promise<void>
  clearError: () => void
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  userRecipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,

  getPublicRecipes: async (page = 0, size = 20, search?, category?) => {
    set({ isLoading: true, error: null })
    try {
      const response = await recipeService.getPublicRecipes(page, size, search, category)
      set({ recipes: response.content || response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  searchPublicRecipes: async (searchTerm?, category?, page = 0, size = 20) => {
    set({ isLoading: true, error: null })
    try {
      const response = await recipeService.searchPublicRecipes(searchTerm, category, page, size)
      set({ recipes: response.content || response, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  getUserRecipes: async (search?, category?, tag?) => {
    set({ isLoading: true, error: null })
    try {
      const recipes = await recipeService.getUserRecipes(search, category, tag)
      set({ userRecipes: recipes, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  getRecipeById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const recipe = await recipeService.getRecipeById(id)
      set({ currentRecipe: recipe, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createRecipe: async (data: any) => {
    set({ isLoading: true, error: null })
    try {
      const recipe = await recipeService.createRecipe(data)
      set({ isLoading: false })
      return recipe
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateRecipe: async (id: string, data: any) => {
    set({ isLoading: true, error: null })
    try {
      const recipe = await recipeService.updateRecipe(id, data)
      set({ currentRecipe: recipe, isLoading: false })
      return recipe
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteRecipe: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await recipeService.deleteRecipe(id)
      set((state) => ({
        userRecipes: state.userRecipes.filter((r) => r.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  rateRecipe: async (id: string, rating: number) => {
    try {
      const recipe = await recipeService.rateRecipe(id, rating)
      set({ currentRecipe: recipe })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  toggleVisibility: async (id: string) => {
    try {
      const recipe = await recipeService.toggleVisibility(id)
      set({ currentRecipe: recipe })
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
