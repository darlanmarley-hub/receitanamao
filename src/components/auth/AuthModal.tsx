import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { UserProfile } from '../../types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        if (tab === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) {
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email || email,
              full_name: data.user.user_metadata?.full_name || email.split('@')[0],
              dietary_restrictions: [],
              favorite_categories: [],
              is_premium: false,
            });
            onClose();
          }
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
          });
          if (error) throw error;
          setSuccessMessage('Conta criada com sucesso! Você já pode entrar.');
          setTab('login');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Erro ao autenticar no Supabase.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local Fallback Auth Simulation for immediate zero-config testing
      setTimeout(() => {
        setIsLoading(false);
        const mockUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: tab === 'register' && fullName ? fullName : email.split('@')[0],
          dietary_restrictions: ['Sem Glúten'],
          favorite_categories: ['Almoço & Jantar'],
          is_premium: true,
        };
        onAuthSuccess(mockUser);
        onClose();
      }, 700);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col gap-6">
        {/* Header Tabs */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            R
          </div>
          <h2 className="text-xl font-extrabold text-warm-900 tracking-tight">
            {tab === 'login' ? 'Acessar Receita na Mão' : 'Criar sua Conta Grátis'}
          </h2>
          <p className="text-xs text-warm-500">
            {isSupabaseConfigured ? 'Conectado ao Supabase Auth' : 'Modo Demonstrativo de Autenticação Rápida'}
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-warm-100 p-1 rounded-2xl">
          <button
            onClick={() => { setTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-sage-50 border border-sage-200 text-sage-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <Input
              label="Nome Completo"
              placeholder="Ex: Camila Alcantara"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />
          )}

          <Input
            label="E-mail *"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Senha *"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center shadow-float mt-2"
            icon={tab === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          >
            {tab === 'login' ? 'Entrar no Aplicativo' : 'Criar minha Conta'}
          </Button>
        </form>
      </div>
    </Modal>
  );
};
