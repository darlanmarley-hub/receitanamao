import React from 'react';
import { 
  Sparkles, 
  Link as LinkIcon, 
  Plus, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Heart, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import type { Recipe, UserProfile } from '../../types';
import { RecipeCard } from '../recipe/RecipeCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface HomeViewProps {
  user: UserProfile;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onCookNow: (recipe: Recipe, e: React.MouseEvent) => void;
  onOpenImportModal: () => void;
  onOpenCreateModal: () => void;
  onSelectTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  recipes,
  onSelectRecipe,
  onToggleFavorite,
  onCookNow,
  onOpenImportModal,
  onOpenCreateModal,
  onSelectTab,
}) => {
  const favorites = recipes.filter(r => r.is_favorite);
  const quickRecipes = recipes.filter(r => (r.prep_time + r.cook_time) <= 30);

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-warm-900 via-brand-900 to-brand-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-72 h-72 bg-saffron-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <span className="text-xs font-extrabold text-saffron-400 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Cozinha Inteligente
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Olá, {user.full_name.split(' ')[0]}! <br className="hidden sm:inline" />
            O que vamos cozinhar hoje?
          </h1>
          <p className="text-xs sm:text-sm text-warm-200 leading-relaxed mt-1">
            Transforme qualquer link da internet em uma ficha técnica organizada com ingredientes e modo de preparo.
          </p>

          {/* Quick Action Grid */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <Button
              onClick={onOpenImportModal}
              variant="primary"
              size="md"
              className="!text-white font-bold shadow-float bg-brand-500 hover:bg-brand-600 border border-white/20"
              icon={<LinkIcon className="w-4 h-4 text-white" />}
            >
              Importar Receita
            </Button>
            <Button
              onClick={onOpenCreateModal}
              variant="outline"
              size="md"
              className="!text-white font-semibold bg-white/15 hover:bg-white/25 border-white/30"
              icon={<Plus className="w-4 h-4 text-white" />}
            >
              Criar Receita
            </Button>
            <Button
              onClick={() => onSelectTab('shopping')}
              variant="outline"
              size="md"
              className="!text-white font-semibold bg-white/10 hover:bg-white/20 border-white/20"
              icon={<ShoppingCart className="w-4 h-4 text-white" />}
            >
              Lista de Compras
            </Button>
            <Button
              onClick={() => onSelectTab('planner')}
              variant="outline"
              size="md"
              className="!text-white font-semibold bg-white/10 hover:bg-white/20 border-white/20"
              icon={<Calendar className="w-4 h-4 text-white" />}
            >
              Planejar Semana
            </Button>
          </div>
        </div>

        {/* Hero Feature Visual Card */}
        <div 
          onClick={() => recipes[0] && onSelectRecipe(recipes[0])}
          className="hidden lg:flex flex-col gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-xs cursor-pointer hover:scale-105 transition-transform z-10"
        >
          <div className="relative rounded-xl overflow-hidden h-36">
            <img src={recipes[0]?.image_url} alt="Destaque" className="w-full h-full object-cover" />
            <Badge variant="brand" className="absolute top-2 left-2 bg-brand-500 text-white font-bold border-none">
              Destaque do Dia
            </Badge>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white line-clamp-1">{recipes[0]?.title}</h4>
            <span className="text-xs text-saffron-300 font-semibold">{recipes[0]?.prep_time + recipes[0]?.cook_time} min • {recipes[0]?.category}</span>
          </div>
        </div>
      </div>

      {/* Section 1: Continuar Preparando */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-saffron-500" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-warm-900">
              Continuar Preparando
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('my-recipes')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              onToggleFavorite={onToggleFavorite}
              onCookNow={onCookNow}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Suas Favoritas */}
      {favorites.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />
              <h2 className="font-display text-lg sm:text-xl font-bold text-warm-900">
                Suas Receitas Favoritas
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('favorites')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              Ver salvas ({favorites.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.slice(0, 3).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={onSelectRecipe}
                onToggleFavorite={onToggleFavorite}
                onCookNow={onCookNow}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Receitas Rápidas (Até 30 min) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sage-600" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-warm-900">
              Receitas Rápidas (Prontas em até 30 min)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              onToggleFavorite={onToggleFavorite}
              onCookNow={onCookNow}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
