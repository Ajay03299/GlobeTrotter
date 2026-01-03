'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-500/30': variant === 'primary',
            'bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-500/20': variant === 'secondary',
            'text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-500/20': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500/30': variant === 'danger',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-5 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
