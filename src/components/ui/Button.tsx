import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'disabled:pointer-events-none disabled:opacity-40',
          variant === 'primary' &&
            'bg-ink-900 hover:bg-ink-700 text-white rounded-full',
          variant === 'secondary' &&
            'bg-ink-100 hover:bg-ink-300/60 text-ink-900 rounded-full',
          size === 'default' && 'h-11 px-6 text-sm',
          size === 'sm' && 'h-9 px-4 text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
