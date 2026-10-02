import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Apple, 
  Beef, 
  Milk, 
  Package, 
  Wine, 
  Flame, 
  HelpCircle 
} from 'lucide-react';
import type { ShoppingListItem, IngredientCategory } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';

export interface ShoppingListViewProps {
  items: ShoppingListItem[];
  onToggleBought: (id: string) => void;
  onAddItem: (item: { item: string; amount: string; unit: string; category: IngredientCategory }) => void;
  onDeleteItem: (id: string) => void;
  onClearBought: () => void;
}

const CATEGORY_ICONS: Record<IngredientCategory, React.ReactNode> = {
  Hortifruti: <Apple className="w-4 h-4 text-emerald-600" />,
  Carnes: <Beef className="w-4 h-4 text-red-600" />,
  Laticínios: <Milk className="w-4 h-4 text-amber-600" />,
  Mercearia: <Package className="w-4 h-4 text-orange-600" />,
  Bebidas: <Wine className="w-4 h-4 text-purple-600" />,
  Temperos: <Flame className="w-4 h-4 text-yellow-600" />,
  Outros: <HelpCircle className="w-4 h-4 text-warm-500" />,
};

const CATEGORIES: IngredientCategory[] = [
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Mercearia',
  'Bebidas',
  'Temperos',
  'Outros',
];

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleBought,
  onAddItem,
  onDeleteItem,
  onClearBought
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('Mercearia');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      item: newItemName,
      amount: newItemAmount,
      unit: '',
      category: newItemCategory,
    });

    setNewItemName('');
    setNewItemAmount('1');
    setIsAddModalOpen(false);
  };

  const totalCount = items.length;
  const boughtCount = items.filter(i => i.bought).length;
  const progressPercent = totalCount > 0 ? Math.round((boughtCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-500 via-brand-600 to-warm-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <ShoppingCart className="w-3.5 h-3.5 text-saffron-400" />
            Minha Lista de Compras Inteligente
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
            Ingredientes para suas Receitas
          </h1>
          <p className="text-xs sm:text-sm text-warm-200 mt-1 max-w-md">
            Organizados automaticamente por corredor de supermercado para facilitar suas compras.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="accent"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Adicionar Item
          </Button>

          {boughtCount > 0 && (
            <Button
              onClick={onClearBought}
              variant="outline"
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              icon={<Trash2 className="w-4 h-4" />}
            >
              Limpar Comprados ({boughtCount})
            </Button>
          )}
        </div>
      </div>

      {/* Progress Card */}
      {totalCount > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-soft flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-warm-800">
            <span>Progresso das Compras</span>
            <span className="text-brand-600">{boughtCount} de {totalCount} itens ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-warm-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-sage-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Categories Grouped Items */}
      {totalCount === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Sua lista de compras está vazia!"
          description="Adicione ingredientes manualmente ou importe diretamente a partir de qualquer receita."
          actionText="Adicionar Item Manualmente"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((cat) => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0) return null;

            return (
              <div key={cat} className="bg-white rounded-3xl border border-warm-200 shadow-soft overflow-hidden">
                {/* Category Header */}
                <div className="bg-warm-50 px-6 py-3.5 border-b border-warm-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-warm-900">
                    {CATEGORY_ICONS[cat]}
                    <span>{cat}</span>
                    <span className="text-xs text-warm-500 font-normal">({catItems.length})</span>
                  </div>
                </div>

                {/* Items List */}
                <ul className="divide-y divide-warm-100">
                  {catItems.map((item) => (
                    <li
                      key={item.id}
                      className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-warm-50/50 ${
                        item.bought ? 'bg-warm-50/40 text-warm-400' : 'text-warm-900'
                      }`}
                    >
                      <div 
                        onClick={() => onToggleBought(item.id)}
                        className="flex items-center gap-3.5 flex-1 cursor-pointer"
                      >
                        <div className={`mt-0.5 transition-colors ${item.bought ? 'text-sage-500' : 'text-warm-400'}`}>
                          {item.bought ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className={`text-sm font-semibold ${item.bought ? 'line-through text-warm-400' : 'text-warm-900'}`}>
                            {item.amount && <strong className="mr-1.5 text-brand-600">{item.amount}</strong>}
                            {item.item}
                          </span>
                          {item.recipe_title && (
                            <span className="block text-[11px] text-warm-400">Receita: {item.recipe_title}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-warm-300 hover:text-red-500 rounded-lg transition-colors"
                        title="Excluir item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Item de Compra" maxWidth="md">
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome do Item *"
            placeholder="Ex: Leite condensado, Maçãs Fuji..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantidade"
              placeholder="Ex: 2kg, 1 caixa, 500g"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
            />

            <div>
              <label className="text-xs font-semibold text-warm-700 tracking-wide block mb-1.5">Categoria</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as IngredientCategory)}
                className="w-full bg-white border border-warm-300 text-warm-900 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center shadow-float mt-2"
          >
            Adicionar à Lista
          </Button>
        </form>
      </Modal>
    </div>
  );
};
