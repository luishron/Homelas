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
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  parseISO,
  endOfWeek,
  getMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';


interface ExpenseHeatmapClientProps {
  data: DailyExpenseFrequency[];
  currency: CurrencyCode;
}

type DayData = {
  date: string;
  count: number;
  total: number;
  dayOfWeek: number;
};

export function ExpenseHeatmapClient({
  data,
  currency,
}: ExpenseHeatmapClientProps) {
  const t = useTranslations('pages.dashboard.heatmap');

  // Convert sparse data to Map for O(1) lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, DailyExpenseFrequency>();
    data.forEach((item) => map.set(item.date, item));
    return map;
  }, [data]);

  // Always show year view (last 365 days)
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    return { startDate, endDate };
  }, []);

  // Generate all days in range (fill gaps)
  const allDays = useMemo(() => {
    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    });

    return days.map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayData = dataMap.get(dateKey);

      return {
        date: dateKey,
        count: dayData?.count || 0,
        total: dayData?.total || 0,
        dayOfWeek: date.getDay(), // 0 (Sunday) - 6 (Saturday)
      };
    });
  }, [dataMap, dateRange]);

  // Create a 2D grid: grid[row][col] where row = day of week (0-6), col = week number
  const gridData = useMemo(() => {
    if (allDays.length === 0) return { grid: [], weeks: [] };

    // Calculate week number for each day (0-indexed from start date)
    const daysWithWeek = allDays.map((day) => {
      const dayDate = parseISO(day.date);
      const dayOfWeek = dayDate.getDay();
      // Convert to Monday-first: Mon=0, Tue=1, ..., Sun=6
      const rowIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Calculate week number from start date
      const daysSinceStart = Math.floor(
        (dayDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNumber = Math.floor((daysSinceStart + (dateRange.startDate.getDay() === 0 ? 6 : dateRange.startDate.getDay() - 1)) / 7);

      return { ...day, rowIndex, weekNumber };
    });

    // Get total number of weeks
    const maxWeek = Math.max(...daysWithWeek.map((d) => d.weekNumber));
    const totalWeeks = maxWeek + 1;

    // Create empty grid: 7 rows × N columns
    const grid: (DayData | null)[][] = Array(7)
      .fill(null)
      .map(() => Array(totalWeeks).fill(null));

    // Fill the grid
    daysWithWeek.forEach((day) => {
      if (day.rowIndex >= 0 && day.rowIndex < 7 && day.weekNumber >= 0 && day.weekNumber < totalWeeks) {
        grid[day.rowIndex][day.weekNumber] = day;
      }
    });

    // Get week start dates for month labels
    const weeks = Array(totalWeeks)
      .fill(null)
      .map((_, weekIndex) => {
        const daysInWeek = 7;
        const dayOffset = weekIndex * daysInWeek - (dateRange.startDate.getDay() === 0 ? 6 : dateRange.startDate.getDay() - 1);
        const weekStart = new Date(dateRange.startDate);
        weekStart.setDate(weekStart.getDate() + dayOffset);
        return weekStart;
      });

    return { grid, weeks };
  }, [allDays, dateRange]);

  // Calculate month labels positions
  const monthLabels = useMemo(() => {
    const labels: Array<{ text: string; colIndex: number }> = [];
    let lastMonth = -1;

    gridData.weeks.forEach((weekStart, index) => {
      const month = getMonth(weekStart);
      if (month !== lastMonth) {
        labels.push({
          text: format(weekStart, 'MMM', { locale: es }),
          colIndex: index,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [gridData]);

  // GitHub-style color intensity (NO borders, only background)
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-muted/20 dark:bg-muted/10';
    if (count <= 2) return 'bg-primary/25';
    if (count <= 4) return 'bg-primary/50';
    if (count <= 6) return 'bg-primary/75';
    return 'bg-primary'; // 7+
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = allDays.length;
    const activeDays = allDays.filter((d) => d.count > 0).length;
    const totalExpenses = allDays.reduce((sum, d) => sum + d.count, 0);
    const streak = calculateCurrentStreak(allDays);

    return {
      activeDays,
      totalDays,
      totalExpenses,
      streak,
      consistency: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
    };
  }, [allDays]);

  // Day labels - GitHub only shows Mon, Wed, Fri
  const dayLabels = [
    t('days.mon'),
    '', // Tuesday hidden
    t('days.wed'),
    '', // Thursday hidden
    t('days.fri'),
    '', // Saturday hidden
    '', // Sunday hidden
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {t('title')}
              {/* Streak Badge */}
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
        {/* Empty State for new users */}
        {stats.activeDays === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t('emptyState.title')}
            </h3>
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
            {/* Heatmap grid - GitHub style */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-full">
                {/* Month labels (horizontal) */}
                <div className="flex mb-2">
                  <div className="w-[30px] flex-shrink-0" /> {/* Space for day labels */}
                  <div className="flex gap-1 relative h-4">
                    {monthLabels.map((label, index) => (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground absolute font-medium"
                        style={{
                          left: `${label.colIndex * 14}px`, // 11px cell + 3px gap
                        }}
                      >
                        {label.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid: 7 rows (days of week) × N columns (weeks) */}
                <div className="flex gap-1">
                  {/* Day labels (vertical) - only Mon, Wed, Fri like GitHub */}
                  <div className="flex flex-col gap-1 w-[30px] flex-shrink-0 pr-2">
                    {dayLabels.map((label, index) => (
                      <div
                        key={index}
                        className="h-[11px] flex items-center justify-end text-[11px] text-muted-foreground"
                      >
                        {label}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap cells - Grid 2D: 7 rows × N columns */}
                  <div className="flex gap-1">
                    {/* Iterate through columns (weeks) */}
                    {gridData.grid[0]?.map((_, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1">
                        {/* Iterate through rows (days of week) */}
                        {gridData.grid.map((row, rowIndex) => {
                          const day = row[colIndex];
                          return (
                            <div key={rowIndex}>
                              {day ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className={`
                                        w-[11px] h-[11px] rounded-sm transition-all duration-150
                                        hover:ring-2 hover:ring-ring hover:ring-offset-1
                                        focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none
                                        ${getIntensityClass(day.count)}
                                      `}
                                      aria-label={t('cell.ariaLabel', {
                                        date: format(parseISO(day.date), 'PPP', {
                                          locale: es,
                                        }),
                                        count: day.count,
                                      })}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs space-y-1">
                                      <p className="font-semibold">
                                        {format(parseISO(day.date), 'PPP', { locale: es })}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {t('tooltip.expenses', { count: day.count })}
                                      </p>
                                      {day.total > 0 && (
                                        <p className="font-medium text-primary">
                                          {formatCurrency(day.total, currency)}
                                        </p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <div className="w-[11px] h-[11px]" /> // Empty space
                              )}
                            </div>
                          );
                        })}
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
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to calculate current streak
function calculateCurrentStreak(days: DayData[]): number {
  let streak = 0;
  const sortedDays = [...days].reverse(); // Start from most recent

  for (const day of sortedDays) {
    if (day.count > 0) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}
