import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'saffron' | 'sage' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  onClick
}) => {
  const variantStyles = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200',
    saffron: 'bg-saffron-50 text-saffron-600 border border-saffron-200',
    sage: 'bg-sage-50 text-sage-600 border border-sage-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    neutral: 'bg-warm-100 text-warm-700 border border-warm-200',
    outline: 'bg-transparent text-warm-700 border border-warm-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1 font-medium rounded-md',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold rounded-lg',
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center justify-center shrink-0 transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${onClick ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </Component>
  );
};
