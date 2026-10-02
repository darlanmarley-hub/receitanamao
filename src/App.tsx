import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import type { ActiveTab } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TopHeader } from './components/layout/TopHeader';

import { HomeView } from './components/home/HomeView';
import { ExploreView } from './components/explore/ExploreView';
import { MyRecipesView } from './components/recipe/MyRecipesView';
import { ShoppingListView } from './components/shopping/ShoppingListView';
import { WeeklyPlannerView } from './components/planner/WeeklyPlannerView';
import { ProfileView } from './components/profile/ProfileView';

import { RecipeDetailModal } from './components/recipe/RecipeDetailModal';
import { CookModeModal } from './components/recipe/CookModeModal';
import { ImportRecipeModal } from './components/recipe/ImportRecipeModal';
import { RecipeFormModal } from './components/recipe/RecipeFormModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/Toast';
import type { ToastMessage } from './components/common/Toast';

import type { Recipe, ShoppingListItem, MealPlanSlot, UserProfile, DayOfWeek, MealType, IngredientCategory } from './types';
import { INITIAL_CATEGORIES } from './mock/initialData';
import { StorageService } from './services/storageService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlanSlot[]>([]);
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());

  // Modal & Modal Overlay States
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Partial<Recipe> | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load initial data
  useEffect(() => {
    const loadedRecipes = StorageService.getRecipes();
    setRecipes(loadedRecipes);

    const loadedShopping = StorageService.getShoppingList();
    setShoppingList(loadedShopping);

    const loadedPlan = StorageService.getMealPlan();
    setMealPlan(loadedPlan);

    // Supabase auth state listener
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(prev => ({
            ...prev,
            id: session.user.id,
            email: session.user.email || prev.email,
          }));
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Handlers
  const handleToggleFavorite = async (recipeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await StorageService.toggleFavorite(recipeId);
    setRecipes(updated);

    const target = updated.find(r => r.id === recipeId);
    if (target) {
      if (target.is_favorite) {
        addToast('success', 'Receita adicionada aos favoritos!');
      } else {
        addToast('info', 'Receita removida dos favoritos.');
      }
    }
  };

  const handleSaveRecipe = async (recipeData: Partial<Recipe>) => {
    const updated = await StorageService.saveRecipe(recipeData);
    setRecipes(updated);
    setIsCreateModalOpen(false);
    setEditingRecipe(null);
    addToast('success', 'Receita salva com sucesso!');
  };

  const handleRecipeImported = (importedData: Partial<Recipe>) => {
    setEditingRecipe(importedData);
    setIsCreateModalOpen(true);
    addToast('info', 'Receita analisada! Revise as informações antes de salvar.');
  };

  const handleAddIngredientsToShopping = (
    recipeTitle: string,
    recipeId: string,
    ingredients: { item: string; amount: string; unit?: string; category: any }[]
  ) => {
    const updated = StorageService.addIngredientsToShoppingList(recipeTitle, recipeId, ingredients);
    setShoppingList(updated);
    addToast('success', `${ingredients.length} ingrediente(s) adicionado(s) à lista de compras!`);
  };

  const handleToggleShoppingItem = (id: string) => {
    const updated = shoppingList.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    );
    setShoppingList(updated);
    StorageService.saveShoppingList(updated);
  };

  const handleAddShoppingItem = (item: { item: string; amount: string; unit: string; category: IngredientCategory }) => {
    const newItem: ShoppingListItem = {
      id: `shop-${Date.now()}`,
      item: item.item,
      amount: item.amount,
      unit: item.unit,
      category: item.category,
      bought: false,
      created_at: new Date().toISOString()
    };
    const updated = [newItem, ...shoppingList];
    setShoppingList(updated);
    StorageService.saveShoppingList(updated);
    addToast('success', 'Item adicionado à lista de compras.');
  };

  const handleDeleteShoppingItem = (id: string) => {
    const updated = shoppingList.filter(i => i.id !== id);
    setShoppingList(updated);
    StorageService.saveShoppingList(updated);
  };

  const handleClearBoughtShoppingItems = () => {
    const updated = shoppingList.filter(i => !i.bought);
    setShoppingList(updated);
    StorageService.saveShoppingList(updated);
    addToast('info', 'Itens comprados removidos.');
  };

  const handleAddMealToPlan = (day: DayOfWeek, mealType: MealType, recipe: Recipe) => {
    const newSlot: MealPlanSlot = {
      id: `mp-${Date.now()}`,
      day,
      meal_type: mealType,
      recipe
    };
    const updated = [...mealPlan.filter(m => !(m.day === day && m.meal_type === mealType)), newSlot];
    setMealPlan(updated);
    StorageService.saveMealPlan(updated);
    addToast('success', `Adicionado ao planejamento de ${day}!`);
  };

  const handleRemoveMealFromPlan = (slotId: string) => {
    const updated = mealPlan.filter(s => s.id !== slotId);
    setMealPlan(updated);
    StorageService.saveMealPlan(updated);
  };

  const handleGenerateShoppingListFromPlan = () => {
    const allIngredients: { item: string; amount: string; unit?: string; category: any }[] = [];
    mealPlan.forEach(slot => {
      if (slot.recipe?.ingredients) {
        slot.recipe.ingredients.forEach(ing => {
          allIngredients.push({
            item: ing.item,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category,
          });
        });
      }
    });

    if (allIngredients.length === 0) {
      addToast('info', 'Adicione receitas ao planejamento da semana primeiro.');
      return;
    }

    const updated = StorageService.addIngredientsToShoppingList('Planejamento Semanal', 'plan', allIngredients);
    setShoppingList(updated);
    setActiveTab('shopping');
    addToast('success', 'Lista de compras da semana gerada com sucesso!');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    addToast('info', 'Sessão encerrada.');
  };

  return (
    <div className="flex min-h-screen bg-warm-50 font-sans text-warm-900">
      {/* Sidebar Navigation for Desktop */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenCreateModal={() => {
          setEditingRecipe(null);
          setIsCreateModalOpen(true);
        }}
        user={user}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateModal={() => {
            setEditingRecipe(null);
            setIsCreateModalOpen(true);
          }}
          onSelectTab={setActiveTab}
          user={user}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView
              user={user}
              recipes={recipes}
              onSelectRecipe={setSelectedRecipe}
              onToggleFavorite={handleToggleFavorite}
              onCookNow={(r) => setCookingRecipe(r)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenCreateModal={() => {
                setEditingRecipe(null);
                setIsCreateModalOpen(true);
              }}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              allRecipes={recipes}
              categories={INITIAL_CATEGORIES}
              onSelectRecipe={setSelectedRecipe}
              onToggleFavorite={handleToggleFavorite}
              onCookNow={(r) => setCookingRecipe(r)}
            />
          )}

          {activeTab === 'my-recipes' && (
            <MyRecipesView
              recipes={recipes}
              onSelectRecipe={setSelectedRecipe}
              onToggleFavorite={handleToggleFavorite}
              onCookNow={(r) => setCookingRecipe(r)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenCreateModal={() => {
                setEditingRecipe(null);
                setIsCreateModalOpen(true);
              }}
              onExploreRecipes={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'favorites' && (
            <MyRecipesView
              recipes={recipes}
              isFavoritesOnly
              onSelectRecipe={setSelectedRecipe}
              onToggleFavorite={handleToggleFavorite}
              onCookNow={(r) => setCookingRecipe(r)}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenCreateModal={() => {
                setEditingRecipe(null);
                setIsCreateModalOpen(true);
              }}
              onExploreRecipes={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'shopping' && (
            <ShoppingListView
              items={shoppingList}
              onToggleBought={handleToggleShoppingItem}
              onAddItem={handleAddShoppingItem}
              onDeleteItem={handleDeleteShoppingItem}
              onClearBought={handleClearBoughtShoppingItems}
            />
          )}

          {activeTab === 'planner' && (
            <WeeklyPlannerView
              mealPlan={mealPlan}
              allRecipes={recipes}
              onAddMeal={handleAddMealToPlan}
              onRemoveMeal={handleRemoveMealFromPlan}
              onGenerateShoppingList={handleGenerateShoppingListFromPlan}
              onSelectRecipe={setSelectedRecipe}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                StorageService.saveUserProfile(updated);
                addToast('success', 'Perfil atualizado!');
              }}
              onLogout={handleLogout}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      {/* Modal Dialog Overlays */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        onStartCooking={(recipe) => {
          setSelectedRecipe(null);
          setCookingRecipe(recipe);
        }}
        onEditRecipe={(recipe) => {
          setSelectedRecipe(null);
          setEditingRecipe(recipe);
          setIsCreateModalOpen(true);
        }}
        onAddIngredientsToShopping={handleAddIngredientsToShopping}
      />

      <CookModeModal
        recipe={cookingRecipe}
        isOpen={Boolean(cookingRecipe)}
        onClose={() => setCookingRecipe(null)}
      />

      <ImportRecipeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onRecipeImported={handleRecipeImported}
      />

      <RecipeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRecipe(null);
        }}
        onSaveRecipe={handleSaveRecipe}
        initialRecipe={editingRecipe}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authUser) => {
          setUser(authUser);
          StorageService.saveUserProfile(authUser);
          addToast('success', `Bem-vindo(a), ${authUser.full_name}!`);
        }}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
