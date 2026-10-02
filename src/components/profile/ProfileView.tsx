import React, { useState } from 'react';
import { User, Mail, Sparkles, Check, Lock, LogOut } from 'lucide-react';
import type { UserProfile } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';

export interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenAuthModal
}) => {
  const [fullName, setFullName] = useState(user.full_name);
  const [restrictions, setRestrictions] = useState<string[]>(user.dietary_restrictions || []);
  const [isSaved, setIsSaved] = useState(false);

  const toggleRestriction = (item: string) => {
    setRestrictions(prev => 
      prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      full_name: fullName,
      dietary_restrictions: restrictions,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const allRestrictions = ['Sem Glúten', 'Sem Lactose', 'Vegetariana', 'Vegan', 'Low Carb', 'Sem Açúcar'];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-12">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user.full_name}
            className="w-20 h-20 rounded-full object-cover border-4 border-brand-500 shadow-md"
          />
          <div>
            <h1 className="font-display text-2xl font-black text-warm-900">{user.full_name}</h1>
            <p className="text-xs text-warm-500 font-medium flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
              <Badge variant={user.is_premium ? 'saffron' : 'neutral'} size="sm">
                <Sparkles className="w-3 h-3" /> {user.is_premium ? 'Plano Chef Premium' : 'Plano Gratuito'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onOpenAuthModal} variant="outline" size="sm" icon={<Lock className="w-4 h-4" />}>
            Conta & Login
          </Button>
          <Button onClick={onLogout} variant="ghost" size="sm" icon={<LogOut className="w-4 h-4 text-red-500" />}>
            Sair
          </Button>
        </div>
      </div>

      {/* Monetization / Premium Upgrade Architecture Banner */}
      <div className="bg-gradient-to-r from-saffron-500 via-amber-500 to-brand-500 rounded-3xl p-6 sm:p-8 text-warm-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-xl z-10">
          <Badge variant="brand" className="w-fit bg-warm-900 text-white font-bold border-none">
            ⭐ Receita na Mão PREMIUM
          </Badge>
          <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight">
            Desbloqueie importação ilimitada e sugestões de IA
          </h3>
          <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
            Planejamento semanal automatizado, tabela nutricional completa e geração de PDFs sem limites.
          </p>
        </div>

        <Button
          onClick={() => alert('Assinatura Premium em breve! Você já está aproveitando os recursos avançados na versão demonstração.')}
          variant="primary"
          size="lg"
          className="bg-warm-900 hover:bg-black text-white border-none shadow-xl shrink-0 font-bold"
          icon={<Sparkles className="w-5 h-5 text-saffron-400" />}
        >
          Conhecer Plano Premium
        </Button>
      </div>

      {/* Profile Form Details */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-soft flex flex-col gap-6">
        <h3 className="font-display text-lg font-bold text-warm-900 border-b border-warm-100 pb-3">
          Preferências Alimentares & Pessoais
        </h3>

        <Input
          label="Nome Completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<User className="w-4 h-4" />}
        />

        {/* Dietary Restrictions checkboxes */}
        <div>
          <label className="text-xs font-semibold text-warm-700 tracking-wide block mb-2">
            Restrições ou Preferências Alimentares
          </label>
          <div className="flex flex-wrap gap-2">
            {allRestrictions.map((item) => {
              const active = restrictions.includes(item);
              return (
                <Badge
                  key={item}
                  variant={active ? 'brand' : 'outline'}
                  onClick={() => toggleRestriction(item)}
                  className="cursor-pointer text-xs py-2 px-3 rounded-xl"
                  icon={active ? <Check className="w-3.5 h-3.5" /> : undefined}
                >
                  {item}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-fit self-start shadow-md"
        >
          {isSaved ? 'Preferências Salvas!' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
};
