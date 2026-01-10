'use client';

import Link from 'next/link';
import { CardFinance } from '@/components/ui/card-finance';
import { MoneyDisplay } from '@/components/ui/money-display';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CategoryWithData = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total?: number;
  recentExpenses?: Array<{
    id: number;
    description: string | null;
    amount: string;
    date: string;
  }>;
};

export interface CategoryCardCompactProps {
  category: CategoryWithData;
}

/**
 * CategoryCardCompact - Financial Vitality Design
 *
 * A bold, data-forward card design that makes financial information feel
 * important, energetic, and trustworthy. The design emphasizes the money
 * amount as hero content with confident typography and dynamic visual elements.
 *
 * Design Philosophy:
 * - Money is hero content (largest, boldest element)
 * - Dynamic hover states suggest financial growth
 * - Asymmetric layouts create visual interest
 * - Subtle animations add vitality without distraction
 * - Strategic use of Tallify green (#9FFF66) for emphasis
 *
 * Responsive:
 * - Mobile (<640px): Horizontal layout, icon + stacked content
 * - Tablet+ (≥640px): Vertical layout, centered composition
 */
export function CategoryCardCompact({ category }: CategoryCardCompactProps) {
  const transactionCount = category.recentExpenses?.length || 0;

  return (
    <Link href={`/dashboard/categories/${category.id}`} className="group/card block">
      <CardFinance
        variant="elevated"
        accentPosition="none"
        interactive
        className={cn(
          'relative overflow-hidden',
          'transition-all duration-500 ease-out',
          'hover:shadow-2xl sm:hover:-translate-y-1',
          // Subtle background pattern on hover
          'before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
          'hover:before:opacity-100',
          'before:bg-[radial-gradient(circle_at_50%_120%,rgba(159,255,102,0.03),transparent_50%)]'
        )}
        style={{
          // Animated gradient border effect
          backgroundImage: `linear-gradient(to bottom, transparent 0%, transparent 100%)`,
        }}
      >
        {/* Animated accent bar - grows on hover */}
        <div
          className="absolute top-0 left-0 h-1 w-0 transition-all duration-700 ease-out group-hover/card:w-full"
          style={{ backgroundColor: category.color }}
        />

        <div className="flex flex-row sm:flex-col items-start sm:items-center gap-5 p-5 sm:p-6 min-h-[110px] sm:min-h-[240px] relative z-10">
          {/* Icon with dynamic glow */}
          <div className="relative flex-shrink-0 group/icon">
            {/* Animated glow effect */}
            <div
              className={cn(
                'absolute inset-0 rounded-3xl blur-2xl opacity-20',
                'transition-all duration-700 ease-out',
                'group-hover/card:blur-3xl group-hover/card:opacity-40',
                'group-hover/card:scale-125'
              )}
              style={{ backgroundColor: category.color }}
            />

            {/* Icon container with subtle rotation on hover */}
            <div
              className={cn(
                'relative flex items-center justify-center',
                'h-20 w-20 sm:h-24 sm:w-24',
                'rounded-3xl',
                'text-5xl sm:text-6xl',
                'transition-all duration-700 ease-out',
                'group-hover/card:rotate-6 group-hover/card:scale-110',
                // Subtle inner shadow for depth
                'shadow-inner'
              )}
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
                boxShadow: `inset 0 2px 8px ${category.color}20`
              }}
            >
              {category.icon || '📦'}
            </div>

            {/* Animated pulse ring */}
            <div
              className={cn(
                'absolute inset-0 rounded-3xl',
                'opacity-0 group-hover/card:opacity-100',
                'transition-all duration-700',
                'animate-[ping_2s_ease-in-out_infinite]'
              )}
              style={{
                border: `2px solid ${category.color}40`,
              }}
            />
          </div>

          {/* Content - grows and becomes prominent on hover */}
          <div className="flex flex-col gap-3 flex-1 min-w-0 sm:items-center sm:text-center">
            {/* Category name - refined typography */}
            <h3
              className={cn(
                'text-base sm:text-lg font-bold tracking-tight',
                'truncate w-full',
                'transition-all duration-300',
                'group-hover/card:text-foreground/90'
              )}
              style={{
                // Use a more distinctive font stack
                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {category.name}
            </h3>

            {/* Money amount - HERO ELEMENT */}
            <div className="relative">
              {/* Background glow effect for amount */}
              <div
                className={cn(
                  'absolute inset-0 blur-xl opacity-0',
                  'transition-opacity duration-500',
                  'group-hover/card:opacity-30'
                )}
                style={{ backgroundColor: '#9FFF66' }}
              />

              <div
                className={cn(
                  'relative text-3xl sm:text-4xl font-black',
                  'tabular-nums tracking-tighter',
                  'transition-all duration-500',
                  'group-hover/card:scale-110 group-hover/card:text-[#9FFF66]',
                  // Add subtle text shadow for depth
                  'drop-shadow-sm'
                )}
                style={{
                  fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                  letterSpacing: '-0.04em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <MoneyDisplay
                  amount={category.total || 0}
                  size="md"
                  className="font-black"
                />
              </div>
            </div>

            {/* Transaction count badge - minimal, refined */}
            {transactionCount > 0 && (
              <div className="relative">
                <Badge
                  variant="paid-soft"
                  className={cn(
                    'text-[10px] sm:text-xs font-medium',
                    'px-3 py-1.5',
                    'truncate max-w-full',
                    'self-start sm:self-center',
                    'transition-all duration-300',
                    'hover:scale-105',
                    // Subtle backdrop blur
                    'backdrop-blur-sm',
                    // Border animation on hover
                    'border border-transparent',
                    'group-hover/card:border-current'
                  )}
                  style={{
                    color: category.color,
                    backgroundColor: `${category.color}12`,
                    borderColor: `${category.color}30`
                  }}
                >
                  <span className="opacity-60">{transactionCount}</span>
                  {' '}
                  <span className="font-semibold">
                    {transactionCount === 1 ? 'gasto' : 'gastos'}
                  </span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Bottom gradient accent - subtle depth */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-32',
            'opacity-0 transition-opacity duration-700',
            'group-hover/card:opacity-100',
            'pointer-events-none'
          )}
          style={{
            background: `linear-gradient(to top, ${category.color}08, transparent)`
          }}
        />
      </CardFinance>
    </Link>
  );
}
