import React from 'react';
import { Heart, Clock, Utensils, Flame } from 'lucide-react';
import type { Recipe } from '../../types';
import { Badge } from '../common/Badge';

export interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onCookNow?: (recipe: Recipe, e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onToggleFavorite,
  onCookNow,
}) => {
  const totalTime = recipe.prep_time + recipe.cook_time;

  const difficultyVariant = {
    Fácil: 'sage',
    Médio: 'saffron',
    Difícil: 'brand',
  }[recipe.difficulty] as 'sage' | 'saffron' | 'brand';

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group bg-white rounded-3xl overflow-hidden border border-warm-200/80 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Image Container */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-warm-100">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge variant="brand" size="sm" className="backdrop-blur-md bg-white/90 font-bold shadow-sm">
              {recipe.category}
            </Badge>
            {recipe.is_imported && (
              <Badge variant="saffron" size="sm" className="backdrop-blur-md bg-saffron-500 text-warm-900 font-bold">
                Importada
              </Badge>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-warm-700 hover:text-brand-500 hover:scale-110 active:scale-95 transition-all shadow-md z-10"
            title={recipe.is_favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                recipe.is_favorite ? 'fill-brand-500 text-brand-500' : ''
              }`}
            />
          </button>

          {/* Bottom Overlay Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-saffron-500" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
              <Flame className="w-3.5 h-3.5 text-brand-400" />
              <span>{recipe.nutrition.calories} kcal</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-2.5">
          <h3 className="font-display font-bold text-base text-warm-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-xs text-warm-600 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-warm-100 text-xs">
        <Badge variant={difficultyVariant} size="sm">
          {recipe.difficulty}
        </Badge>

        {onCookNow && (
          <button
            onClick={(e) => onCookNow(recipe, e)}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Cozinhar</span>
          </button>
        )}
      </div>
    </div>
  );
};
