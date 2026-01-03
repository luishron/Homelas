'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils/formatting';
import type { DailyExpenseFrequency } from '@/lib/db';
import type { CurrencyCode } from '@/lib/config/currencies';
import { useTranslations } from 'next-intl';
import { addDays, startOfWeek, format, parseISO, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseHeatmapClientProps {
  data: DailyExpenseFrequency[];
  currency: CurrencyCode;
}

type CellData = {
  date: string;
  count: number;
  total: number;
} | null;

export function ExpenseHeatmapClient({ data, currency }: ExpenseHeatmapClientProps) {
  const t = useTranslations('pages.dashboard.heatmap');

  // Convert data to Map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, DailyExpenseFrequency>();
    data.forEach((item) => map.set(item.date, item));
    return map;
  }, [data]);

  // Generate grid: Start from last Sunday, go back 52 weeks (364 days)
  const { cells, monthLabels } = useMemo(() => {
    const today = new Date();
    const endDate = startOfWeek(today, { weekStartsOn: 1 }); // Last Monday
    const totalDays = 364; // Exactly 52 weeks
    const startDate = addDays(endDate, -totalDays);

    // Generate all cells (52 weeks × 7 days = 364 cells)
    const allCells: CellData[] = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(startDate, i);
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const dayData = dataMap.get(dateKey);

      allCells.push(
        dayData
          ? { date: dateKey, count: dayData.count, total: dayData.total }
          : null
      );
    }

    // Calculate month labels
    const labels: Array<{ text: string; column: number }> = [];
    let lastMonth = -1;

    for (let week = 0; week < 52; week++) {
      const weekStartDate = addDays(startDate, week * 7);
      const month = getMonth(weekStartDate);

      if (month !== lastMonth) {
        labels.push({
          text: format(weekStartDate, 'MMM', { locale: es }),
          column: week,
        });
        lastMonth = month;
      }
    }

    return { cells: allCells, monthLabels: labels };
  }, [dataMap]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = cells.length;
    const activeDays = cells.filter((c) => c && c.count > 0).length;
    const totalExpenses = cells.reduce((sum, c) => sum + (c?.count || 0), 0);

    // Calculate streak
    let streak = 0;
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i] && cells[i]!.count > 0) {
        streak++;
      } else {
        break;
      }
    }

    return {
      activeDays,
      totalDays,
      totalExpenses,
      streak,
      consistency: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
    };
  }, [cells]);

  // Color intensity
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-muted/20 dark:bg-muted/10';
    if (count <= 2) return 'bg-primary/25';
    if (count <= 4) return 'bg-primary/50';
    if (count <= 6) return 'bg-primary/75';
    return 'bg-primary';
  };

  const dayLabels = ['Lun', '', 'Mié', '', 'Vie', '', ''];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {t('title')}
              {stats.streak >= 3 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                  🔥 {stats.streak} {stats.streak === 1 ? 'día' : 'días'}
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('subtitle', {
                activeDays: stats.activeDays,
                totalDays: stats.totalDays,
                consistency: stats.consistency,
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {stats.activeDays === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('emptyState.title')}</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              {t('emptyState.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-[11px] h-[11px] rounded-sm bg-muted/20" />
                <div className="w-[11px] h-[11px] rounded-sm bg-primary/25" />
                <div className="w-[11px] h-[11px] rounded-sm bg-primary/50" />
                <div className="w-[11px] h-[11px] rounded-sm bg-primary/75" />
                <div className="w-[11px] h-[11px] rounded-sm bg-primary" />
              </div>
              <span>{t('emptyState.hint')}</span>
            </div>
          </div>
        ) : (
          <TooltipProvider>
            <div className="overflow-x-auto pb-2">
              {/* Month labels */}
              <div className="flex mb-2 ml-[34px]">
                <div className="relative h-4" style={{ width: '52 * 14px' }}>
                  {monthLabels.map((label, idx) => (
                    <span
                      key={idx}
                      className="absolute text-xs text-muted-foreground font-medium"
                      style={{ left: `${label.column * 14}px` }}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid container */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 w-[30px] pr-1">
                  {dayLabels.map((label, idx) => (
                    <div key={idx} className="h-[11px] flex items-center justify-end text-[11px] text-muted-foreground">
                      {label}
                    </div>
                  ))}
                </div>

                {/* CSS Grid for perfect alignment */}
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: 'repeat(52, 11px)',
                    gridTemplateRows: 'repeat(7, 11px)',
                    gridAutoFlow: 'column', // Fill by column (week)
                  }}
                >
                  {cells.map((cell, idx) => (
                    <div key={idx}>
                      {cell ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`
                                w-[11px] h-[11px] rounded-sm transition-all duration-150
                                hover:ring-2 hover:ring-ring hover:ring-offset-1
                                focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none
                                ${getIntensityClass(cell.count)}
                              `}
                              aria-label={`${cell.date}: ${cell.count} gastos`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p className="font-semibold">
                                {format(parseISO(cell.date), 'PPP', { locale: es })}
                              </p>
                              <p className="text-muted-foreground">
                                {t('tooltip.expenses', { count: cell.count })}
                              </p>
                              {cell.total > 0 && (
                                <p className="font-medium text-primary">
                                  {formatCurrency(cell.total, currency)}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="w-[11px] h-[11px] rounded-sm bg-muted/20 dark:bg-muted/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>{t('legend.less')}</span>
                <div className="flex gap-1">
                  <div className="w-[11px] h-[11px] rounded-sm bg-muted/20 dark:bg-muted/10" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-primary/25" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-primary/50" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-primary/75" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-primary" />
                </div>
                <span>{t('legend.more')}</span>
              </div>
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}
