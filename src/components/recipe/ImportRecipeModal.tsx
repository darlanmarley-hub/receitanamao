import React, { useState } from 'react';
import { Link as LinkIcon, Sparkles, Loader2, Video, Globe, Play, Share2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Recipe } from '../../types';
import { RecipeImportService } from '../../services/recipeImportService';

export interface ImportRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeImported: (recipe: Partial<Recipe>) => void;
}

export const ImportRecipeModal: React.FC<ImportRecipeModalProps> = ({
  isOpen,
  onClose,
  onRecipeImported
}) => {
  const [url, setUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Por favor, cole um link de receita válido.');
      return;
    }
    setErrorMessage('');
    setIsImporting(true);
    setProgressPercent(10);
    setProgressMessage('Iniciando análise do link...');

    try {
      const parsedRecipe = await RecipeImportService.importFromUrl(url, (percent, msg) => {
        setProgressPercent(percent);
        setProgressMessage(msg);
      });

      setIsImporting(false);
      setUrl('');
      onClose();
      onRecipeImported(parsedRecipe);
    } catch (err) {
      setIsImporting(false);
      setErrorMessage('Não foi possível extrair a receita deste link. Tente outro link.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="flex flex-col gap-6">
        {/* Header Hero */}
        <div className="text-center flex flex-col items-center gap-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-saffron-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
            <LinkIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-warm-900 tracking-tight">
              Transforme qualquer receita em uma ficha organizada
            </h2>
            <p className="text-xs sm:text-sm text-warm-600 mt-1 max-w-md mx-auto leading-relaxed">
              Cole o link da receita e deixe o aplicativo organizar os ingredientes e o modo de preparo para você.
            </p>
          </div>
        </div>

        {/* Supported Platforms Banner */}
        <div className="flex items-center justify-center gap-4 py-2 border-y border-warm-100 text-xs text-warm-500 font-semibold">
          <span className="flex items-center gap-1.5"><Share2 className="w-4 h-4 text-pink-600" /> Instagram</span>
          <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-black" /> TikTok</span>
          <span className="flex items-center gap-1.5"><Play className="w-4 h-4 text-red-600" /> YouTube</span>
          <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-brand-600" /> Sites de Culinária</span>
        </div>

        {/* Form or Progress Loader */}
        {!isImporting ? (
          <form onSubmit={handleImport} className="flex flex-col gap-4">
            <Input
              label="Link da receita"
              placeholder="https://www.instagram.com/p/... ou https://site.com/receita"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              icon={<LinkIcon className="w-4 h-4" />}
              error={errorMessage}
            />

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center mt-2 shadow-float"
              icon={<Sparkles className="w-5 h-5 text-warm-900" />}
            >
              Importar receita
            </Button>
          </form>
        ) : (
          /* Animated Step Progress */
          <div className="py-8 flex flex-col items-center text-center gap-4 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-saffron-500 absolute" />
            </div>
            
            <div className="w-full max-w-md bg-warm-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-500 to-saffron-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-sm font-bold text-warm-800 animate-pulse">
              {progressMessage}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
