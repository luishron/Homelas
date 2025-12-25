/**
 * Utilidades para agrupación de fechas estilo Wise
 *
 * Agrupa transacciones por períodos relativos: "Today", "Yesterday", "This Week", etc.
 */

import { format, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export type DateGroup = 'today' | 'yesterday' | 'this-week' | 'this-month' | 'earlier';

export interface GroupedItem<T> {
  date: Date;
  item: T;
}

export interface DateGroupResult<T> {
  label: string;
  date?: Date;
  items: T[];
  total?: number;
}

/**
 * Obtiene el label relativo de una fecha ("Hoy", "Ayer", "Mar 8, 2023")
 */
export function getRelativeDateLabel(date: Date): string {
  if (isToday(date)) {
    return 'Hoy';
  }

  if (isYesterday(date)) {
    return 'Ayer';
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    // Día de la semana (ej: "Lunes", "Martes")
    return format(date, 'EEEE', { locale: es });
  }

  if (isThisMonth(date)) {
    // Día y mes (ej: "Mar 8")
    return format(date, 'MMM d', { locale: es });
  }

  if (isThisYear(date)) {
    // Día y mes (ej: "8 de marzo")
    return format(date, "d 'de' MMMM", { locale: es });
  }

  // Fecha completa (ej: "8 de marzo, 2023")
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
}

/**
 * Obtiene el grupo de fecha relativo
 */
export function getDateGroup(date: Date): DateGroup {
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';
  if (isThisWeek(date, { weekStartsOn: 1 })) return 'this-week';
  if (isThisMonth(date)) return 'this-month';
  return 'earlier';
}

/**
 * Agrupa items por fecha relativa
 */
export function groupByDate<T extends { date: Date | string }>(
  items: T[],
  calculateTotal?: (items: T[]) => number
): DateGroupResult<T>[] {
  // Convertir dates a objetos Date si son strings
  const normalizedItems = items.map((item) => ({
    ...item,
    date: typeof item.date === 'string' ? new Date(item.date) : item.date,
  }));

  // Ordenar por fecha descendente (más reciente primero)
  const sorted = [...normalizedItems].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Agrupar por día
  const grouped = new Map<string, T[]>();

  sorted.forEach((item) => {
    const dayKey = startOfDay(item.date).toISOString();
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(item);
  });

  // Convertir a array de grupos
  const groups: DateGroupResult<T>[] = [];

  grouped.forEach((items, dayKey) => {
    const date = new Date(dayKey);
    const label = getRelativeDateLabel(date);
    const total = calculateTotal ? calculateTotal(items) : undefined;

    groups.push({
      label,
      date,
      items,
      total,
    });
  });

  return groups;
}

/**
 * Agrupa items por categoría de fecha (hoy, ayer, esta semana, etc.)
 */
export function groupByDateCategory<T extends { date: Date | string }>(
  items: T[]
): Record<DateGroup, T[]> {
  const result: Record<DateGroup, T[]> = {
    today: [],
    yesterday: [],
    'this-week': [],
    'this-month': [],
    earlier: [],
  };

  items.forEach((item) => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
    const group = getDateGroup(date);
    result[group].push(item);
  });

  return result;
}

/**
 * Filtra items por rango de fechas
 */
export function filterByDateRange<T extends { date: Date | string }>(
  items: T[],
  startDate?: Date,
  endDate?: Date
): T[] {
  return items.filter((item) => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;

    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;

    return true;
  });
}

/**
 * Obtiene el label de un período
 */
export function getPeriodLabel(period: 'today' | 'yesterday' | 'this-week' | 'this-month' | 'this-year'): string {
  const labels = {
    today: 'Hoy',
    yesterday: 'Ayer',
    'this-week': 'Esta semana',
    'this-month': 'Este mes',
    'this-year': 'Este año',
  };

  return labels[period];
}

/**
 * Formatea una fecha en formato corto (ej: "8 mar")
 */
export function formatShortDate(date: Date): string {
  return format(date, 'd MMM', { locale: es });
}

/**
 * Formatea una fecha en formato largo (ej: "8 de marzo de 2023")
 */
export function formatLongDate(date: Date): string {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formatea una hora (ej: "14:30")
 */
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

/**
 * Formatea fecha y hora (ej: "Hoy, 14:30" o "8 mar, 14:30")
 */
export function formatDateTime(date: Date): string {
  const dateLabel = getRelativeDateLabel(date);
  const time = formatTime(date);
  return `${dateLabel}, ${time}`;
}

/**
 * Verifica si dos fechas son el mismo día
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Obtiene el rango de fechas para un período
 */
export function getDateRangeForPeriod(period: 'today' | 'yesterday' | 'this-week' | 'this-month' | 'this-year'): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const startOfToday = startOfDay(now);

  switch (period) {
    case 'today':
      return {
        start: startOfToday,
        end: now,
      };

    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        start: startOfDay(yesterday),
        end: new Date(startOfToday.getTime() - 1),
      };
    }

    case 'this-week': {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lunes
      return {
        start: startOfDay(startOfWeek),
        end: now,
      };
    }

    case 'this-month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start: startOfMonth,
        end: now,
      };
    }

    case 'this-year': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return {
        start: startOfYear,
        end: now,
      };
    }
  }
}
