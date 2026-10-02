import type { Recipe, ShoppingListItem, MealPlanSlot, UserProfile } from '../types';
import { INITIAL_RECIPES, INITIAL_SHOPPING_LIST, INITIAL_MEAL_PLAN, INITIAL_USER } from '../mock/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const RECIPES_KEY = 'receita_na_mao_recipes';
const SHOPPING_KEY = 'receita_na_mao_shopping';
const MEAL_PLAN_KEY = 'receita_na_mao_meal_plan';
const USER_KEY = 'receita_na_mao_user_profile';

export class StorageService {
  // --- RECIPES ---
  static getRecipes(): Recipe[] {
    try {
      const stored = localStorage.getItem(RECIPES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading recipes from local storage', e);
    }
    this.saveRecipes(INITIAL_RECIPES);
    return INITIAL_RECIPES;
  }

  static saveRecipes(recipes: Recipe[]): void {
    try {
      localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Error saving recipes', e);
    }
  }

  static async toggleFavorite(recipeId: string): Promise<Recipe[]> {
    const recipes = this.getRecipes();
    const updated = recipes.map(r => r.id === recipeId ? { ...r, is_favorite: !r.is_favorite } : r);
    this.saveRecipes(updated);

    if (isSupabaseConfigured && supabase) {
      const recipe = updated.find(r => r.id === recipeId);
      if (recipe) {
        if (recipe.is_favorite) {
          await supabase.from('favorites').insert([{ recipe_id: recipeId }]);
        } else {
          await supabase.from('favorites').delete().eq('recipe_id', recipeId);
        }
      }
    }

    return updated;
  }

  static async saveRecipe(recipe: Partial<Recipe>): Promise<Recipe[]> {
    const recipes = this.getRecipes();
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);

    const now = new Date().toISOString();
    let updatedRecipes: Recipe[];

    if (existingIndex >= 0) {
      const fullRecipe: Recipe = {
        ...recipes[existingIndex],
        ...recipe,
        updated_at: now,
      } as Recipe;
      recipes[existingIndex] = fullRecipe;
      updatedRecipes = [...recipes];
    } else {
      const newRecipe: Recipe = {
        id: recipe.id || `rec-${Date.now()}`,
        title: recipe.title || 'Nova Receita',
        description: recipe.description || '',
        image_url: recipe.image_url || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1000&q=80',
        source_url: recipe.source_url || '',
        source_type: recipe.source_type || 'manual',
        category: recipe.category || 'Almoço & Jantar',
        difficulty: recipe.difficulty || 'Fácil',
        prep_time: recipe.prep_time || 15,
        cook_time: recipe.cook_time || 15,
        servings: recipe.servings || 4,
        is_favorite: Boolean(recipe.is_favorite),
        is_imported: Boolean(recipe.is_imported),
        tags: recipe.tags || ['Caseiro'],
        created_at: now,
        updated_at: now,
        nutrition: recipe.nutrition || {
          calories: 350,
          protein: 18,
          carbohydrates: 30,
          fat: 14,
          fiber: 3,
          is_estimated: true
        },
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
      };
      updatedRecipes = [newRecipe, ...recipes];
    }

    this.saveRecipes(updatedRecipes);
    return updatedRecipes;
  }

  static deleteRecipe(recipeId: string): Recipe[] {
    const recipes = this.getRecipes();
    const updated = recipes.filter(r => r.id !== recipeId);
    this.saveRecipes(updated);
    return updated;
  }

  // --- SHOPPING LIST ---
  static getShoppingList(): ShoppingListItem[] {
    try {
      const stored = localStorage.getItem(SHOPPING_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading shopping list', e);
    }
    this.saveShoppingList(INITIAL_SHOPPING_LIST);
    return INITIAL_SHOPPING_LIST;
  }

  static saveShoppingList(items: ShoppingListItem[]): void {
    try {
      localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving shopping list', e);
    }
  }

  static addIngredientsToShoppingList(
    recipeTitle: string,
    recipeId: string,
    ingredients: { item: string; amount: string; unit?: string; category: any }[]
  ): ShoppingListItem[] {
    const currentList = this.getShoppingList();
    const newItems: ShoppingListItem[] = ingredients.map(ing => ({
      id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipe_id: recipeId,
      recipe_title: recipeTitle,
      item: ing.item,
      amount: ing.amount,
      unit: ing.unit || '',
      category: ing.category || 'Outros',
      bought: false,
      created_at: new Date().toISOString()
    }));

    const updated = [...newItems, ...currentList];
    this.saveShoppingList(updated);
    return updated;
  }

  // --- MEAL PLAN ---
  static getMealPlan(): MealPlanSlot[] {
    try {
      const stored = localStorage.getItem(MEAL_PLAN_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading meal plan', e);
    }
    this.saveMealPlan(INITIAL_MEAL_PLAN);
    return INITIAL_MEAL_PLAN;
  }

  static saveMealPlan(plan: MealPlanSlot[]): void {
    try {
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
    } catch (e) {
      console.error('Error saving meal plan', e);
    }
  }

  // --- USER PROFILE ---
  static getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading user profile', e);
    }
    this.saveUserProfile(INITIAL_USER);
    return INITIAL_USER;
  }

  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving user profile', e);
    }
  }
}
