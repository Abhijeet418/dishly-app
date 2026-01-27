import api from '@/lib/api'
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Recipe,
  RecipeList,
  RecipeRequest,
  UpdateRecipeRequest,
  RecipeCollection,
  CollectionRequest,
} from '@/types'

// Auth Services
export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Recipe Services
export const recipeService = {
  getUserRecipes: async (
    search?: string,
    category?: string,
    tag?: string,
    sort?: string
  ): Promise<RecipeList[]> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (tag) params.append('tag', tag)
    if (sort) params.append('sort', sort)

    const response = await api.get('/recipes', { params })
    return response.data
  },

  getPublicRecipes: async (
    page: number = 0,
    size: number = 20,
    search?: string,
    category?: string
  ): Promise<any> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (search) params.append('search', search)
    if (category) params.append('category', category)

    const response = await api.get('/recipes/public', { params })
    return response.data
  },

  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`)
    return response.data
  },

  createRecipe: async (data: RecipeRequest): Promise<Recipe> => {
    const response = await api.post('/recipes', data)
    return response.data
  },

  updateRecipe: async (id: string, data: UpdateRecipeRequest): Promise<Recipe> => {
    const response = await api.put(`/recipes/${id}`, data)
    return response.data
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`)
  },

  toggleVisibility: async (id: string): Promise<Recipe> => {
    const response = await api.patch(`/recipes/${id}/visibility`)
    return response.data
  },

  rateRecipe: async (id: string, rating: number): Promise<Recipe> => {
    const response = await api.patch(`/recipes/${id}/rating`, { rating })
    return response.data
  },

  searchPublicRecipes: async (
    searchTerm?: string,
    category?: string,
    page: number = 0,
    size: number = 20
  ): Promise<any> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('size', size.toString())
    if (searchTerm) params.append('q', searchTerm)
    if (category) params.append('category', category)

    const response = await api.get('/recipes/search', { params })
    return response.data
  },

  copyRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.post(`/recipes/${id}/copy`)
    return response.data
  },

  likeRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.post(`/recipes/${id}/like`)
    return response.data
  },

  unlikeRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.delete(`/recipes/${id}/like`)
    return response.data
  },
}

// Collection Services
export const collectionService = {
  getCollections: async (): Promise<RecipeCollection[]> => {
    const response = await api.get('/collections')
    return response.data
  },

  createCollection: async (data: CollectionRequest): Promise<RecipeCollection> => {
    const response = await api.post('/collections', data)
    return response.data
  },

  addRecipeToCollection: async (collectionId: string, recipeId: string): Promise<RecipeCollection> => {
    const response = await api.post(`/collections/${collectionId}/recipes/${recipeId}`)
    return response.data
  },

  removeRecipeFromCollection: async (collectionId: string, recipeId: string): Promise<void> => {
    await api.delete(`/collections/${collectionId}/recipes/${recipeId}`)
  },

  deleteCollection: async (id: string): Promise<void> => {
    await api.delete(`/collections/${id}`)
  },

  getCollectionRecipes: async (collectionId: string): Promise<RecipeList[]> => {
    const response = await api.get(`/collections/${collectionId}/recipes`)
    return response.data
  },
}


