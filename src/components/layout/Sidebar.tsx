import React from 'react';
import { 
  Home, 
  Compass, 
  BookOpen, 
  Heart, 
  ShoppingCart, 
  Calendar, 
  User, 
  Plus, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '../common/Button';
import type { UserProfile } from '../../types';

export type ActiveTab = 
  | 'home' 
  | 'explore' 
  | 'my-recipes' 
  | 'favorites' 
  | 'shopping' 
  | 'planner' 
  | 'profile';

export interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenImportModal: () => void;
  onOpenCreateModal: () => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenImportModal,
  onOpenCreateModal,
  user
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Início', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explorar', icon: Compass },
    { id: 'my-recipes' as ActiveTab, label: 'Minhas Receitas', icon: BookOpen },
    { id: 'favorites' as ActiveTab, label: 'Favoritas', icon: Heart },
    { id: 'shopping' as ActiveTab, label: 'Lista de Compras', icon: ShoppingCart },
    { id: 'planner' as ActiveTab, label: 'Planejamento', icon: Calendar },
    { id: 'profile' as ActiveTab, label: 'Perfil', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white/90 backdrop-blur-xl border-r border-warm-200 h-screen sticky top-0 shrink-0 p-6 justify-between z-30 shadow-soft">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5 mb-8 cursor-pointer group" onClick={() => onSelectTab('home')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-2xl tracking-tighter">R</span>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-warm-900 tracking-tight leading-tight">
              Receita<span className="text-brand-500">naMão</span>
            </h1>
            <p className="text-[10px] text-brand-600 font-bold tracking-wider uppercase">Cozinha Inteligente</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-8">
          <Button
            onClick={onOpenImportModal}
            variant="accent"
            size="md"
            className="w-full justify-center shadow-float"
            icon={<LinkIcon className="w-4 h-4" />}
          >
            Importar Receita
          </Button>
          <Button
            onClick={onOpenCreateModal}
            variant="outline"
            size="md"
            className="w-full justify-center"
            icon={<Plus className="w-4 h-4 text-brand-500" />}
          >
            Nova Receita
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20 scale-[1.02]'
                    : 'text-warm-700 hover:bg-warm-100 hover:text-warm-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-warm-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Box */}
      <div className="pt-4 border-t border-warm-200/80">
        <div 
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-warm-100 transition-colors cursor-pointer border border-transparent hover:border-warm-200"
        >
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-warm-900 truncate">{user.full_name}</h4>
            <span className="inline-flex items-center gap-1 text-[11px] text-warm-500 truncate">
              <Sparkles className="w-3 h-3 text-saffron-500" />
              {user.is_premium ? 'Plano Chef Premium' : 'Plano Gratuito'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
