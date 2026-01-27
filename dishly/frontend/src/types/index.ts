export interface User {
  id: string
  email: string
  username: string
  name: string
  createdAt: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  isPublic: boolean
  averageRating: number
  ratingCount: number
  likeCount: number
  isLiked: boolean
  imageUrls: string[]
  ingredients: Ingredient[]
  instructions: Instruction[]
  categories: string[]
  tags: string[]
  userId?: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface RecipeList {
  id: string
  title: string
  imageUrls: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  averageRating: number
  ratingCount: number
  likeCount: number
  isLiked: boolean
  categories: string[]
  difficulty: string
  servings: number
  username: string
}

export interface Ingredient {
  id?: string
  name: string
  quantity: number
  unit: string
  order: number
}

export interface Instruction {
  id?: string
  stepNumber: number
  description: string
}

export interface Rating {
  id: string
  recipeId: string
  userId: string
  username: string
  rating: number
  review?: string
  createdAt: string
  updatedAt: string
}

export interface RatingRequest {
  rating: number
  review?: string
}

export interface RecipeCollection {
  id: string
  name: string
  recipeCount: number
  recipeIds: string[]
  createdAt: string
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  isChecked: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  username: string
}

export interface RecipeRequest {
  title: string
  description?: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  isPublic?: boolean
  imageUrls?: string[]
  ingredients: Ingredient[]
  instructions: Instruction[]
  categories?: string[]
  tags?: string[]
}

export interface UpdateRecipeRequest extends Partial<RecipeRequest> {}

export interface CollectionRequest {
  name: string
}

export interface ShoppingListRequest {
  name: string
  recipeIds: string[]
}

export interface RatingRequest {
  rating: number
}
