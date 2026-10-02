import React, { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import type { Recipe, Category } from '../../types';
import { RecipeCard } from '../recipe/RecipeCard';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { AISuggestionService } from '../../services/aiSuggestionService';

export interface ExploreViewProps {
  allRecipes: Recipe[];
  categories: Category[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onCookNow: (recipe: Recipe, e: React.MouseEvent) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  allRecipes,
  categories,
  onSelectRecipe,
  onToggleFavorite,
  onCookNow
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Todas');
  const [maxTime, setMaxTime] = useState<number>(60);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Prompt input state
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResultSummary, setAiResultSummary] = useState<string | null>(null);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResultSummary(null);

    const res = await AISuggestionService.getSuggestions({
      prompt: aiQuery,
      allRecipes,
    });

    setIsAiLoading(false);
    setAiResultSummary(res.aiResponseSummary);
  };

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Todas' || recipe.difficulty === selectedDifficulty;
    const matchesTime = (recipe.prep_time + recipe.cook_time) <= maxTime;
    const matchesQuery = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(i => i.item.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesTime && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
      {/* AI Smart Prompt Banner */}
      <div className="bg-gradient-to-tr from-warm-900 via-brand-900 to-saffron-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 w-64 h-64 bg-saffron-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-saffron-400 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Chef Inteligente IA
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            O que você está com vontade de cozinhar hoje?
          </h1>
          <p className="text-xs sm:text-sm text-warm-200 leading-relaxed">
            Diga seus ingredientes disponíveis ou desejo (ex: <i>"Quero algo rápido com frango e requeijão"</i>) e a IA encontrará a receita perfeita!
          </p>
        </div>

        <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-3 z-10">
          <div className="flex-1 relative flex items-center">
            <Sparkles className="w-4 h-4 text-saffron-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ex: Quero um jantar rápido na Air Fryer com batatas..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-warm-300 text-xs sm:text-sm rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20"
            />
          </div>
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={isAiLoading}
            className="shadow-float"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Encontrar Receitas
          </Button>
        </form>

        {aiResultSummary && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs font-semibold text-saffron-300 animate-slide-up">
            {aiResultSummary}
          </div>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-warm-900 tracking-wide uppercase">Categorias Gastronômicas</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Badge
            variant={selectedCategory === 'Todas' ? 'brand' : 'outline'}
            onClick={() => setSelectedCategory('Todas')}
            className="cursor-pointer text-xs py-2 px-4 rounded-xl"
          >
            Todas ({allRecipes.length})
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.name ? 'brand' : 'outline'}
              onClick={() => setSelectedCategory(cat.name)}
              className="cursor-pointer text-xs py-2 px-4 rounded-xl"
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-warm-200 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Pesquisar por ingrediente ou prato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-warm-700">Dificuldade:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-warm-100 border border-warm-300 text-xs rounded-xl p-2 focus:outline-none"
            >
              <option value="Todas">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-warm-700">Tempo máximo: {maxTime} min</span>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="accent-brand-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectRecipe}
            onToggleFavorite={onToggleFavorite}
            onCookNow={onCookNow}
          />
        ))}
      </div>
    </div>
  );
};
