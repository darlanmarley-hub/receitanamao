import React from 'react';
import { Home, Compass, BookOpen, ShoppingCart, Calendar, Link as LinkIcon } from 'lucide-react';
import type { ActiveTab } from './Sidebar';

export interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenImportModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenImportModal
}) => {
  const items = [
    { id: 'home' as ActiveTab, label: 'Início', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explorar', icon: Compass },
    { id: 'my-recipes' as ActiveTab, label: 'Receitas', icon: BookOpen },
    { id: 'shopping' as ActiveTab, label: 'Compras', icon: ShoppingCart },
    { id: 'planner' as ActiveTab, label: 'Semana', icon: Calendar },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-warm-200 px-3 py-2 flex items-center justify-around shadow-lg">
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
              isActive ? 'text-brand-500 font-bold' : 'text-warm-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-warm-400'}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      {/* Floating Action Import Button */}
      <button
        onClick={onOpenImportModal}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex flex-col items-center justify-center shadow-lg shadow-brand-500/30 active:scale-95 transform -translate-y-3 border-2 border-white"
        aria-label="Importar Receita"
      >
        <LinkIcon className="w-5 h-5" />
      </button>

      {items.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
              isActive ? 'text-brand-500 font-bold' : 'text-warm-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-warm-400'}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
