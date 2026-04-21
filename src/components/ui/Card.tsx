import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-ink-300/60 rounded-2xl p-6 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
