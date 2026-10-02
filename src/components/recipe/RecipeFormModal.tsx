import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Recipe, RecipeIngredient, RecipeStep, IngredientCategory } from '../../types';

export interface RecipeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: Partial<Recipe>) => void;
  initialRecipe?: Partial<Recipe> | null;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80',
];

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
  initialRecipe
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);
  const [category, setCategory] = useState('Almoço & Jantar');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Fácil');
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('20');
  const [servings, setServings] = useState('4');

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { id: '1', item: 'Ingrediente principal', amount: '500', unit: 'g', category: 'Carnes' },
    { id: '2', item: 'Tempero fresco', amount: '1', unit: 'maço', category: 'Hortifruti' },
  ]);

  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: '1', step_number: 1, instruction: 'Prepare todos os ingredientes e limpe a bancada.', duration_minutes: 5 },
    { id: '2', step_number: 2, instruction: 'Cozinhe em fogo médio até ficar dourado e suculento.', duration_minutes: 15 },
  ]);

  const [calories, setCalories] = useState('380');
  const [protein, setProtein] = useState('25');
  const [carbs, setCarbs] = useState('30');
  const [fat, setFat] = useState('14');

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title || '');
      setDescription(initialRecipe.description || '');
      setImageUrl(initialRecipe.image_url || PRESET_IMAGES[0]);
      setCategory(initialRecipe.category || 'Almoço & Jantar');
      setDifficulty(initialRecipe.difficulty || 'Fácil');
      setPrepTime(String(initialRecipe.prep_time || 15));
      setCookTime(String(initialRecipe.cook_time || 20));
      setServings(String(initialRecipe.servings || 4));
      if (initialRecipe.ingredients?.length) setIngredients(initialRecipe.ingredients);
      if (initialRecipe.steps?.length) setSteps(initialRecipe.steps);
      if (initialRecipe.nutrition) {
        setCalories(String(initialRecipe.nutrition.calories || 350));
        setProtein(String(initialRecipe.nutrition.protein || 20));
        setCarbs(String(initialRecipe.nutrition.carbohydrates || 30));
        setFat(String(initialRecipe.nutrition.fat || 12));
      }
    }
  }, [initialRecipe, isOpen]);

  const addIngredient = () => {
    setIngredients(prev => [
      ...prev,
      { id: Date.now().toString(), item: '', amount: '1', unit: 'unid', category: 'Mercearia' }
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof RecipeIngredient, value: string) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { id: Date.now().toString(), step_number: prev.length + 1, instruction: '', duration_minutes: 5 }
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, step_number: idx + 1 }));
    });
  };

  const updateStep = (id: string, instruction: string, duration?: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, instruction, duration_minutes: duration } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor, informe o nome da receita.');
      return;
    }

    onSaveRecipe({
      id: initialRecipe?.id,
      title,
      description,
      image_url: imageUrl,
      category,
      difficulty,
      prep_time: Number(prepTime) || 15,
      cook_time: Number(cookTime) || 15,
      servings: Number(servings) || 4,
      source_type: initialRecipe?.source_type || 'manual',
      source_url: initialRecipe?.source_url || '',
      is_imported: initialRecipe?.is_imported || false,
      ingredients: ingredients.filter(i => i.item.trim() !== ''),
      steps: steps.filter(s => s.instruction.trim() !== ''),
      nutrition: {
        calories: Number(calories) || 350,
        protein: Number(protein) || 20,
        carbohydrates: Number(carbs) || 30,
        fat: Number(fat) || 12,
        fiber: 3,
        is_estimated: true,
      },
      tags: [category, difficulty],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialRecipe?.id ? 'Editar Receita' : 'Nova Receita'} maxWidth="3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Metadata */}
        <div className="flex flex-col gap-4">
          <Input
            label="Nome da Receita *"
            placeholder="Ex: Risoto Cremoso de Parmesão"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-warm-700 tracking-wide block mb-1.5">Descrição</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve resumo da receita..."
              className="w-full bg-white border border-warm-300 text-warm-900 placeholder:text-warm-400 text-sm rounded-xl p-3 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Image Selection */}
        <div className="flex flex-col gap-2">
          <Input
            label="URL da Foto"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            icon={<Image className="w-4 h-4" />}
          />
          <span className="text-[11px] text-warm-500 font-semibold">Ou escolha uma imagem preset:</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PRESET_IMAGES.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="preset"
                onClick={() => setImageUrl(img)}
                className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition-transform hover:scale-105 shrink-0 ${
                  imageUrl === img ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category, Difficulty, Prep Time, Servings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold text-warm-700 tracking-wide block mb-1.5">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-warm-300 text-warm-900 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="Almoço & Jantar">Almoço & Jantar</option>
              <option value="Air Fryer">Air Fryer</option>
              <option value="Rápidas & Fáceis">Rápidas & Fáceis</option>
              <option value="Fitness & Fit">Fitness & Fit</option>
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Sobremesas">Sobremesas</option>
              <option value="Vegetariana">Vegetariana</option>
              <option value="Massa & Pizza">Massa & Pizza</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-warm-700 tracking-wide block mb-1.5">Dificuldade</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-white border border-warm-300 text-warm-900 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <Input
            label="Preparo (min)"
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />

          <Input
            label="Porções"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>

        {/* Dynamic Ingredients list */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-warm-900">Ingredientes</h4>
            <button
              type="button"
              onClick={addIngredient}
              className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Ingrediente
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Qtd (ex: 500)"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(ing.id, 'amount', e.target.value)}
                  className="w-20 bg-white border border-warm-300 text-xs rounded-xl p-2"
                />
                <input
                  type="text"
                  placeholder="Unid (ex: g, ml)"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                  className="w-20 bg-white border border-warm-300 text-xs rounded-xl p-2"
                />
                <input
                  type="text"
                  placeholder="Nome do ingrediente"
                  value={ing.item}
                  onChange={(e) => updateIngredient(ing.id, 'item', e.target.value)}
                  className="flex-1 bg-white border border-warm-300 text-xs rounded-xl p-2"
                />
                <select
                  value={ing.category}
                  onChange={(e) => updateIngredient(ing.id, 'category', e.target.value as IngredientCategory)}
                  className="w-28 bg-white border border-warm-300 text-xs rounded-xl p-2"
                >
                  <option value="Hortifruti">Hortifruti</option>
                  <option value="Carnes">Carnes</option>
                  <option value="Laticínios">Laticínios</option>
                  <option value="Mercearia">Mercearia</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Temperos">Temperos</option>
                  <option value="Outros">Outros</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeIngredient(ing.id)}
                  className="p-1.5 text-warm-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Steps list */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-warm-900">Modo de Preparo (Passos)</h4>
            <button
              type="button"
              onClick={addStep}
              className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Passo
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                  {step.step_number}
                </span>
                <textarea
                  rows={2}
                  placeholder={`Descreva o passo ${step.step_number}...`}
                  value={step.instruction}
                  onChange={(e) => updateStep(step.id, e.target.value, step.duration_minutes)}
                  className="flex-1 bg-white border border-warm-300 text-xs rounded-xl p-2 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="p-1.5 text-warm-400 hover:text-red-500 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nutritional Information Inputs */}
        <div className="bg-warm-100/70 p-4 rounded-2xl border border-warm-200 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-warm-800 tracking-wide uppercase">Informações Nutricionais Estimadas</h4>
          <div className="grid grid-cols-4 gap-2">
            <Input label="Calorias (kcal)" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
            <Input label="Proteínas (g)" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
            <Input label="Carbos (g)" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            <Input label="Gorduras (g)" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center shadow-float mt-2"
          icon={<Save className="w-5 h-5" />}
        >
          Salvar Receita
        </Button>
      </form>
    </Modal>
  );
};
