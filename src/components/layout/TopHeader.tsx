import React from 'react';
import { Search, Plus, Heart } from 'lucide-react';
import { Button } from '../common/Button';
import type { ActiveTab } from './Sidebar';
import type { UserProfile } from '../../types';

export interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  user: UserProfile;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onSelectTab,
  user
}) => {
  return (
    <header className="sticky top-0 z-20 glass-nav border-b border-warm-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-warm-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Busque uma receita, ingrediente ou prato..."
            className="w-full bg-white border border-warm-200 text-warm-900 placeholder:text-warm-400 text-xs sm:text-sm rounded-2xl pl-10 pr-4 py-2.5 shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onSelectTab('favorites')}
          className="p-2.5 rounded-2xl text-warm-600 hover:text-brand-500 hover:bg-warm-100 transition-colors relative"
          title="Favoritas"
        >
          <Heart className="w-5 h-5" />
        </button>

        <Button
          onClick={onOpenCreateModal}
          variant="primary"
          size="sm"
          className="hidden sm:inline-flex"
          icon={<Plus className="w-4 h-4" />}
        >
          + Nova receita
        </Button>

        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-warm-200"
        >
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user.full_name}
            className="w-9 h-9 rounded-full object-cover border-2 border-brand-500 hover:scale-105 transition-transform"
          />
        </button>
      </div>
    </header>
  );
};
