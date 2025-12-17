import * as React from 'react';
import { Card, CardProps } from './card';
import { cn } from '@/lib/utils';

export interface CardFinanceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  accentPosition?: 'top' | 'left' | 'none';
  accentColor?: string;
  interactive?: boolean;
}

const CardFinance = React.forwardRef<HTMLDivElement, CardFinanceProps>(
  (
    {
      children,
      className,
      variant = 'default',
      accentPosition = 'top',
      accentColor,
      interactive = false,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'relative group overflow-hidden',
          // Base transitions
          'transition-all duration-300',
          // Interactive states
          interactive && [
            'cursor-pointer',
            'hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1'
          ],
          // Variant styles
          {
            // Glassmorphism variant
            'backdrop-blur-xl bg-card/80 border-primary/10 shadow-2xl':
              variant === 'glass',

            // Gradient variant
            'bg-gradient-to-br from-card to-card/50': variant === 'gradient',

            // Elevated variant
            'shadow-lg hover:shadow-2xl': variant === 'elevated'
          },
          // Accent position
          {
            // Top accent bar
            'before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-primary before:via-primary before:to-transparent before:rounded-t-xl':
              accentPosition === 'top',

            // Left accent border
            'border-l-4': accentPosition === 'left'
          },
          accentPosition === 'left' && !accentColor && 'border-l-primary',
          className
        )}
        style={
          accentPosition === 'left' && accentColor
            ? { borderLeftColor: accentColor }
            : undefined
        }
        {...props}
      >
        {/* Hover glow effect */}
        {interactive && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        )}

        {/* Content wrapper */}
        <div className="relative z-10">{children}</div>
      </Card>
    );
  }
);

CardFinance.displayName = 'CardFinance';

export { CardFinance };
