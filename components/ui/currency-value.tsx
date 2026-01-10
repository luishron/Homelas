/**
 * Currency Value Component
 *
 * Wrapper component that ensures all currency values have tabular-nums
 * for proper alignment and improved accessibility (WCAG 2.1 AA).
 */

import { formatCurrency } from '@/lib/utils/formatting';
import type { CurrencyCode } from '@/lib/config/currencies';
import { cn } from '@/lib/utils';

interface CurrencyValueProps {
  amount: number | string;
  currency: CurrencyCode;
  className?: string;
}

/**
 * Displays a formatted currency value with tabular-nums font feature
 *
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD', 'MXN')
 * @param className - Optional additional CSS classes
 */
export function CurrencyValue({ amount, currency, className }: CurrencyValueProps) {
  return (
    <span className={cn('tabular-nums', className)}>
      {formatCurrency(amount, currency)}
    </span>
  );
}
