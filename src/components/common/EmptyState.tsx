import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/70 border border-warm-200 rounded-3xl shadow-soft my-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-warm-900 tracking-tight mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-warm-600 max-w-md mb-6 leading-relaxed">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <Button onClick={onAction} variant="primary" size="md">
            {actionText}
          </Button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <Button onClick={onSecondaryAction} variant="outline" size="md">
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};
