import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Recipe } from '../../types';
import { Button } from '../common/Button';

export interface CookModeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  recipe,
  isOpen,
  onClose
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen && recipe) {
      setCurrentStepIndex(0);
      setIsCompleted(false);
      const firstStep = recipe.steps[0];
      if (firstStep?.duration_minutes) {
        setTimerSeconds(firstStep.duration_minutes * 60);
      } else {
        setTimerSeconds(null);
      }
      setIsTimerRunning(false);
    }
  }, [isOpen, recipe]);

  // Sync step timer when step changes
  useEffect(() => {
    if (recipe && recipe.steps[currentStepIndex]) {
      const step = recipe.steps[currentStepIndex];
      if (step.duration_minutes) {
        setTimerSeconds(step.duration_minutes * 60);
      } else {
        setTimerSeconds(null);
      }
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, recipe]);

  // Timer countdown loop
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play audio beep sound cue
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.log('Audio not supported', e);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const steps = recipe.steps;
  const currentStep = steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsCompleted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-warm-900 text-white flex flex-col justify-between animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-warm-800 bg-warm-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center font-black">
            👨‍🍳
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md">{recipe.title}</h2>
            <p className="text-xs text-warm-400 font-medium">Modo Cozinhar Guiado Passo a Passo</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-warm-800 hover:bg-warm-700 text-warm-300 hover:text-white transition-colors"
          title="Sair do Modo Cozinhar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-warm-800 h-2">
        <div 
          className="bg-gradient-to-r from-brand-500 to-saffron-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-3xl mx-auto w-full">
        {!isCompleted ? (
          <>
            {/* Step Counter Badge */}
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 font-bold text-xs sm:text-sm tracking-widest uppercase">
              PASSO {currentStepIndex + 1} DE {steps.length}
            </div>

            {/* Giant Instruction Text */}
            <p className="text-xl sm:text-3xl font-extrabold text-white leading-relaxed tracking-tight mb-8">
              "{currentStep?.instruction}"
            </p>

            {/* Timer Box (If step has duration) */}
            {timerSeconds !== null && (
              <div className="w-full max-w-sm bg-warm-800/80 border border-warm-700 rounded-3xl p-6 mb-8 flex flex-col items-center gap-3 shadow-xl">
                <div className="flex items-center gap-2 text-saffron-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" /> Timer desta etapa
                </div>
                <div className={`text-4xl sm:text-5xl font-black font-mono tracking-wider ${timerSeconds === 0 ? 'text-red-500 animate-bounce' : 'text-saffron-400'}`}>
                  {formatTimer(timerSeconds)}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    variant={isTimerRunning ? 'danger' : 'accent'}
                    size="md"
                    icon={isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                    {isTimerRunning ? 'Pausar Timer' : 'Iniciar Timer'}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds((currentStep?.duration_minutes || 0) * 60);
                    }}
                    variant="secondary"
                    size="md"
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Reiniciar
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Completion Celebration View */
          <div className="flex flex-col items-center text-center gap-4 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-sage-500/20 text-sage-400 flex items-center justify-center border-2 border-sage-500/40 mb-2">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Parabéns! Prato Concluído!</h2>
            <p className="text-warm-300 text-sm sm:text-base max-w-md">
              Sua receita <strong>"{recipe.title}"</strong> está pronta para ser saboreada! Bom apetite!
            </p>
            <Button
              onClick={onClose}
              variant="accent"
              size="lg"
              className="mt-6"
              icon={<Sparkles className="w-5 h-5" />}
            >
              Concluir & Voltar
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Large Touch Controls */}
      <div className="p-4 sm:p-6 border-t border-warm-800 bg-warm-900/90 backdrop-blur-md flex items-center justify-between gap-4 max-w-3xl mx-auto w-full">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-warm-800 hover:bg-warm-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-sm sm:text-base transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>Anterior</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-500/30 transition-all active:scale-95"
        >
          <span>{currentStepIndex === steps.length - 1 ? 'Finalizar Prato' : 'Próximo Passo'}</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
