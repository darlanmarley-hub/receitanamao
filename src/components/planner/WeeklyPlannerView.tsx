import React, { useState } from 'react';
import { Calendar, Plus, Trash2, ShoppingCart, Clock } from 'lucide-react';
import type { MealPlanSlot, Recipe, DayOfWeek, MealType } from '../../types';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export interface WeeklyPlannerViewProps {
  mealPlan: MealPlanSlot[];
  allRecipes: Recipe[];
  onAddMeal: (day: DayOfWeek, mealType: MealType, recipe: Recipe) => void;
  onRemoveMeal: (slotId: string) => void;
  onGenerateShoppingList: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'SEG', label: 'Segunda-feira' },
  { key: 'TER', label: 'Terça-feira' },
  { key: 'QUA', label: 'Quarta-feira' },
  { key: 'QUI', label: 'Quinta-feira' },
  { key: 'SEX', label: 'Sexta-feira' },
  { key: 'SÁB', label: 'Sábado' },
  { key: 'DOM', label: 'Domingo' },
];

const MEAL_TYPES: { key: MealType; label: string; icon: string }[] = [
  { key: 'breakfast', label: 'Café da Manhã', icon: '☕' },
  { key: 'lunch', label: 'Almoço', icon: '🍲' },
  { key: 'dinner', label: 'Jantar', icon: '🍽️' },
  { key: 'snack', label: 'Lanche', icon: '🍎' },
];

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  mealPlan,
  allRecipes,
  onAddMeal,
  onRemoveMeal,
  onGenerateShoppingList,
  onSelectRecipe
}) => {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('SEG');
  const [selectedSlot, setSelectedSlot] = useState<{ day: DayOfWeek; mealType: MealType } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleSelectRecipeForSlot = (recipe: Recipe) => {
    if (selectedSlot) {
      onAddMeal(selectedSlot.day, selectedSlot.mealType, recipe);
      setSelectedSlot(null);
    }
  };

  const currentDaySlots = mealPlan.filter(slot => slot.day === activeDay);

  const filteredModalRecipes = allRecipes.filter(r => 
    r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-warm-900 via-brand-900 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-saffron-400" />
            Planejador Semanal de Refeições
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
            Planeje sua Semana Gastronômica
          </h1>
          <p className="text-xs sm:text-sm text-warm-200 mt-1 max-w-md">
            Organize os pratos de cada dia e gere sua lista de compras consolidada em apenas 1 clique.
          </p>
        </div>

        <Button
          onClick={onGenerateShoppingList}
          variant="accent"
          size="lg"
          className="shadow-float shrink-0"
          icon={<ShoppingCart className="w-5 h-5 text-warm-900" />}
        >
          Gerar Lista de Compras da Semana
        </Button>
      </div>

      {/* Day Picker Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = activeDay === day.key;
          const count = mealPlan.filter(m => m.day === day.key).length;
          return (
            <button
              key={day.key}
              onClick={() => setActiveDay(day.key)}
              className={`flex flex-col items-center justify-center px-5 py-3 rounded-2xl transition-all shrink-0 border ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-md font-bold scale-105'
                  : 'bg-white text-warm-700 border-warm-200 hover:bg-warm-100 font-semibold'
              }`}
            >
              <span className="text-xs uppercase tracking-wider">{day.key}</span>
              <span className="text-[11px] opacity-80 mt-0.5">{count} prato(s)</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Meal Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MEAL_TYPES.map((type) => {
          const slot = currentDaySlots.find(s => s.meal_type === type.key);
          const recipe = slot?.recipe;

          return (
            <div
              key={type.key}
              className="bg-white rounded-3xl p-5 border border-warm-200 shadow-soft flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between border-b border-warm-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-sm text-warm-900">
                  <span className="text-lg">{type.icon}</span>
                  <span>{type.label}</span>
                </div>
                {slot && (
                  <button
                    onClick={() => onRemoveMeal(slot.id)}
                    className="p-1.5 text-warm-400 hover:text-red-500 rounded-lg"
                    title="Remover refeição"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {recipe ? (
                <div
                  onClick={() => onSelectRecipe(recipe)}
                  className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-warm-50 transition-colors cursor-pointer"
                >
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-warm-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-warm-900 truncate">{recipe.title}</h4>
                    <span className="text-xs text-warm-500 block truncate">{recipe.category}</span>
                    <span className="text-[11px] font-semibold text-brand-600 inline-flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {recipe.prep_time + recipe.cook_time} min
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedSlot({ day: activeDay, mealType: type.key })}
                  className="py-8 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-warm-300 hover:border-brand-500 hover:bg-brand-50/50 rounded-2xl text-warm-500 hover:text-brand-600 transition-all text-xs font-semibold"
                >
                  <Plus className="w-5 h-5 text-brand-500" />
                  <span>Adicionar receita ao {type.label}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Select Recipe Modal for Slot */}
      <Modal
        isOpen={Boolean(selectedSlot)}
        onClose={() => setSelectedSlot(null)}
        title={`Escolher Receita para ${selectedSlot?.day} - ${MEAL_TYPES.find(t => t.key === selectedSlot?.mealType)?.label}`}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pesquisar receita para adicionar..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-white border border-warm-300 text-warm-900 text-xs sm:text-sm rounded-xl p-3 focus:outline-none focus:border-brand-500"
          />

          <div className="max-h-80 overflow-y-auto flex flex-col gap-2 pr-1">
            {filteredModalRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelectRecipeForSlot(r)}
                className="flex items-center justify-between p-3 rounded-2xl border border-warm-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src={r.image_url} alt={r.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-warm-900">{r.title}</h5>
                    <span className="text-[11px] text-warm-500">{r.category} • {r.prep_time + r.cook_time} min</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Selecionar</Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
