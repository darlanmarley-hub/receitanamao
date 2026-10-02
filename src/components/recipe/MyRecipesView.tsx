import React, { useState } from 'react';
import { BookOpen, Heart, Search, Plus, Link as LinkIcon } from 'lucide-react';
import type { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

export interface MyRecipesViewProps {
  recipes: Recipe[];
  isFavoritesOnly?: boolean;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onCookNow: (recipe: Recipe, e: React.MouseEvent) => void;
  onOpenImportModal: () => void;
  onOpenCreateModal: () => void;
  onExploreRecipes: () => void;
}

export const MyRecipesView: React.FC<MyRecipesViewProps> = ({
  recipes,
  isFavoritesOnly = false,
  onSelectRecipe,
  onToggleFavorite,
  onCookNow,
  onOpenImportModal,
  onOpenCreateModal,
  onExploreRecipes,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'imported' | 'manual'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filtered = recipes;

  if (isFavoritesOnly || activeFilter === 'favorites') {
    filtered = filtered.filter(r => r.is_favorite);
  } else if (activeFilter === 'imported') {
    filtered = filtered.filter(r => r.is_imported);
  } else if (activeFilter === 'manual') {
    filtered = filtered.filter(r => !r.is_imported);
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some(i => i.item.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-warm-900 tracking-tight flex items-center gap-2.5">
            {isFavoritesOnly ? (
              <>
                <Heart className="w-7 h-7 text-brand-500 fill-brand-500" /> Minhas Favoritas
              </>
            ) : (
              <>
                <BookOpen className="w-7 h-7 text-brand-500" /> Biblioteca de Receitas
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-warm-500 mt-1">
            {isFavoritesOnly
              ? 'Todas as suas receitas salvas com carinho em um só lugar.'
              : 'Sua coleção pessoal de receitas importadas, criadas e salvas.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onOpenImportModal} variant="accent" size="sm" icon={<LinkIcon className="w-4 h-4" />}>
            Importar
          </Button>
          <Button onClick={onOpenCreateModal} variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {!isFavoritesOnly && (
          <div className="flex items-center gap-2 bg-warm-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'all' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-600'
              }`}
            >
              Todas ({recipes.length})
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'favorites' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-600'
              }`}
            >
              Favoritas ({recipes.filter(r => r.is_favorite).length})
            </button>
            <button
              onClick={() => setActiveFilter('imported')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeFilter === 'imported' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-600'
              }`}
            >
              Importadas ({recipes.filter(r => r.is_imported).length})
            </button>
          </div>
        )}

        <div className="flex-1 max-w-md">
          <Input
            placeholder="Pesquisar nas minhas receitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={isFavoritesOnly ? <Heart className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
          title={isFavoritesOnly ? 'Você ainda não salvou nenhuma receita favorita.' : 'Nenhuma receita encontrada.'}
          description="Encontre e importe receitas incríveis da internet ou crie suas próprias fichas técnicas."
          actionText="Explorar Receitas"
          onAction={onExploreRecipes}
          secondaryActionText="Importar por Link"
          onSecondaryAction={onOpenImportModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              onToggleFavorite={onToggleFavorite}
              onCookNow={onCookNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
