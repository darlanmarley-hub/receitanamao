import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none shadow-sm';

  const variantStyles = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500 shadow-brand-500/20 shadow-md',
    secondary: 'bg-warm-200 hover:bg-warm-300 text-warm-900 focus:ring-warm-400',
    accent: 'bg-saffron-500 hover:bg-saffron-600 text-warm-900 font-semibold focus:ring-saffron-500 shadow-saffron-500/20 shadow-md',
    outline: 'border border-warm-300 hover:border-brand-500 hover:text-brand-600 bg-white text-warm-800 focus:ring-brand-500',
    ghost: 'hover:bg-warm-100 text-warm-800 hover:text-brand-600 focus:ring-warm-300 shadow-none',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-red-500/20',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
