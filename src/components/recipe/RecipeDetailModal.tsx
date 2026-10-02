import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  Users, 
  Share2, 
  Printer, 
  ShoppingCart, 
  Utensils, 
  Edit3, 
  Flame, 
  CheckSquare, 
  Square,
  AlertCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import type { Recipe, RecipeIngredient } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PDFExportService } from '../../services/pdfExportService';

export interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (recipeId: string) => void;
  onStartCooking: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onAddIngredientsToShopping: (recipeTitle: string, recipeId: string, ingredients: RecipeIngredient[]) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onToggleFavorite,
  onStartCooking,
  onEditRecipe,
  onAddIngredientsToShopping,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!recipe) return null;

  const toggleIngredient = (id: string) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAllIngredients = () => {
    const allSelected = recipe.ingredients.every(i => selectedIngredients[i.id]);
    const newState: Record<string, boolean> = {};
    recipe.ingredients.forEach(i => {
      newState[i.id] = !allSelected;
    });
    setSelectedIngredients(newState);
  };

  const handleAddSelectedToShopping = () => {
    const chosen = recipe.ingredients.filter(i => selectedIngredients[i.id] !== false);
    if (chosen.length === 0) {
      alert('Selecione ao menos um ingrediente!');
      return;
    }
    onAddIngredientsToShopping(recipe.title, recipe.id, chosen);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Confira essa receita incrível "${recipe.title}" no Receita na Mão!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportPDF = () => {
    PDFExportService.exportRecipeToPDF(recipe);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="flex flex-col gap-6 -m-6 p-6">
        {/* Hero Section */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-warm-200 shadow-md">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 via-warm-900/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-warm-700 hover:text-brand-500 hover:scale-110 active:scale-95 transition-all shadow-md"
            >
              <Heart className={`w-5 h-5 ${recipe.is_favorite ? 'fill-brand-500 text-brand-500' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="brand" className="bg-brand-500 text-white font-bold border-none">
                {recipe.category}
              </Badge>
              {recipe.is_imported && (
                <Badge variant="saffron" className="bg-saffron-500 text-warm-900 font-bold border-none">
                  Importada de {recipe.source_type}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-warm-100/80 p-4 rounded-2xl border border-warm-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-500 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-warm-500 font-semibold block">Tempo Total</span>
              <span className="text-xs sm:text-sm font-bold text-warm-900">{recipe.prep_time + recipe.cook_time} min</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-saffron-500 shadow-sm">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-warm-500 font-semibold block">Dificuldade</span>
              <span className="text-xs sm:text-sm font-bold text-warm-900">{recipe.difficulty}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sage-600 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-warm-500 font-semibold block">Porções</span>
              <span className="text-xs sm:text-sm font-bold text-warm-900">{recipe.servings} pessoas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-warm-500 font-semibold block">Calorias</span>
              <span className="text-xs sm:text-sm font-bold text-warm-900">{recipe.nutrition.calories} kcal</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-warm-200">
          <Button
            onClick={() => onStartCooking(recipe)}
            variant="accent"
            size="md"
            icon={<Utensils className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Começar a cozinhar
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => onEditRecipe(recipe)}
              variant="outline"
              size="sm"
              icon={<Edit3 className="w-4 h-4" />}
            >
              Editar
            </Button>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
            >
              PDF
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              size="sm"
              icon={<Share2 className="w-4 h-4 text-green-600" />}
            >
              WhatsApp
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="ghost"
              size="sm"
              icon={copiedLink ? <Check className="w-4 h-4 text-sage-600" /> : <Copy className="w-4 h-4" />}
            >
              {copiedLink ? 'Copiado!' : 'Copiar Link'}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-warm-900 tracking-wide uppercase mb-1">Sobre a Receita</h3>
          <p className="text-sm text-warm-700 leading-relaxed">{recipe.description}</p>
          {recipe.source_url && (
            <a
              href={recipe.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline mt-2 font-medium"
            >
              <span>Ver fonte original ({recipe.source_type})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Two-Column Grid: Ingredients & Steps */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Ingredients Column */}
          <div className="md:col-span-5 flex flex-col gap-4 bg-warm-50/70 p-5 rounded-2xl border border-warm-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-warm-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-brand-500" />
                Ingredientes ({recipe.ingredients.length})
              </h3>
              <button
                onClick={selectAllIngredients}
                className="text-xs text-brand-600 hover:underline font-semibold"
              >
                Selecionar todos
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {recipe.ingredients.map((ing) => {
                const isChecked = selectedIngredients[ing.id] !== false;
                return (
                  <li
                    key={ing.id}
                    onClick={() => toggleIngredient(ing.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-white border-warm-200 text-warm-900 shadow-sm'
                        : 'bg-warm-100/60 border-transparent text-warm-400 line-through'
                    }`}
                  >
                    <div className="mt-0.5 text-brand-500">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-warm-400" />}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm">
                      <span className="font-bold text-warm-900 mr-1.5">
                        {ing.amount} {ing.unit}
                      </span>
                      <span>{ing.item}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Button
              onClick={handleAddSelectedToShopping}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
              icon={<ShoppingCart className="w-4 h-4 text-brand-500" />}
            >
              Adicionar à lista de compras
            </Button>
          </div>

          {/* Steps Column */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <h3 className="text-base font-bold text-warm-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-brand-500" />
              Modo de Preparo ({recipe.steps.length} passos)
            </h3>

            <div className="flex flex-col gap-3">
              {recipe.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-warm-200 shadow-soft"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 font-extrabold text-sm flex items-center justify-center shrink-0 border border-brand-200">
                    {step.step_number}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="text-xs sm:text-sm text-warm-900 leading-relaxed">{step.instruction}</p>
                    {step.duration_minutes ? (
                      <span className="text-[11px] font-semibold text-brand-600 inline-flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {step.duration_minutes} min sugeridos
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nutritional Info Footer */}
        <div className="bg-warm-100 p-4 rounded-2xl border border-warm-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-warm-800 tracking-wide uppercase">Informações Nutricionais</h4>
            {recipe.nutrition.is_estimated && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-medium">
                <AlertCircle className="w-3 h-3" /> Valores estimados pela IA
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2 text-center pt-1">
            <div className="bg-white p-2 rounded-xl border border-warm-200">
              <span className="block text-[10px] text-warm-500 uppercase font-semibold">Calorias</span>
              <span className="text-xs font-bold text-warm-900">{recipe.nutrition.calories} kcal</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-warm-200">
              <span className="block text-[10px] text-warm-500 uppercase font-semibold">Proteínas</span>
              <span className="text-xs font-bold text-warm-900">{recipe.nutrition.protein}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-warm-200">
              <span className="block text-[10px] text-warm-500 uppercase font-semibold">Carbos</span>
              <span className="text-xs font-bold text-warm-900">{recipe.nutrition.carbohydrates}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-warm-200">
              <span className="block text-[10px] text-warm-500 uppercase font-semibold">Gorduras</span>
              <span className="text-xs font-bold text-warm-900">{recipe.nutrition.fat}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-warm-200">
              <span className="block text-[10px] text-warm-500 uppercase font-semibold">Fibras</span>
              <span className="text-xs font-bold text-warm-900">{recipe.nutrition.fiber}g</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
