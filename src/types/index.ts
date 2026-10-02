export type DifficultyLevel = 'Fácil' | 'Médio' | 'Difícil';
export type SourceType = 'instagram' | 'tiktok' | 'youtube' | 'web' | 'manual';

export type IngredientCategory = 
  | 'Hortifruti' 
  | 'Carnes' 
  | 'Laticínios' 
  | 'Mercearia' 
  | 'Bebidas' 
  | 'Temperos' 
  | 'Outros';

export interface RecipeIngredient {
  id: string;
  item: string;
  amount: string;
  unit?: string;
  category: IngredientCategory;
  checked?: boolean;
}

export interface RecipeStep {
  id: string;
  step_number: number;
  instruction: string;
  duration_minutes?: number;
}

export interface NutritionData {
  calories: number;       // kcal
  protein: number;        // g
  carbohydrates: number;  // g
  fat: number;            // g
  fiber: number;          // g
  is_estimated: boolean;
}

export interface Recipe {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  image_url: string;
  source_url?: string;
  source_type: SourceType;
  category: string;
  difficulty: DifficultyLevel;
  prep_time: number; // in minutes
  cook_time: number; // in minutes
  servings: number;
  nutrition: NutritionData;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  is_favorite: boolean;
  is_imported?: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  user_id?: string;
  recipe_id?: string;
  recipe_title?: string;
  item: string;
  amount: string;
  unit?: string;
  category: IngredientCategory;
  bought: boolean;
  created_at: string;
}

export type DayOfWeek = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SÁB' | 'DOM';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanSlot {
  id: string;
  day: DayOfWeek;
  meal_type: MealType;
  recipe?: Recipe;
  custom_title?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  dietary_restrictions: string[];
  favorite_categories: string[];
  cooking_time_pref?: string;
  is_premium: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count?: number;
}
