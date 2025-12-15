/**
 * Enums y constantes centralizadas para la aplicación
 */

// ==================== Estados de Pago ====================

export const PAYMENT_STATUS = {
  PENDING: 'pendiente',
  PAID: 'pagado',
  OVERDUE: 'vencido'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// ==================== Frecuencias de Recurrencia ====================

export const RECURRENCE_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
} as const;

export type RecurrenceFrequency = typeof RECURRENCE_FREQUENCY[keyof typeof RECURRENCE_FREQUENCY];

export const RECURRENCE_LABELS: Record<RecurrenceFrequency, string> = {
  [RECURRENCE_FREQUENCY.DAILY]: 'Diario',
  [RECURRENCE_FREQUENCY.WEEKLY]: 'Semanal',
  [RECURRENCE_FREQUENCY.MONTHLY]: 'Mensual',
  [RECURRENCE_FREQUENCY.YEARLY]: 'Anual'
};

// ==================== Tipos de Método de Pago ====================

export const PAYMENT_METHOD_TYPE = {
  CASH: 'efectivo',
  DEBIT_CARD: 'tarjeta_debito',
  CREDIT_CARD: 'tarjeta_credito',
  TRANSFER: 'transferencia'
} as const;

export type PaymentMethodType = typeof PAYMENT_METHOD_TYPE[keyof typeof PAYMENT_METHOD_TYPE];

// ==================== Límites de Datos ====================

export const DATA_LIMITS = {
  DEFAULT_EXPENSES_LIMIT: 100,
  DEFAULT_INCOMES_LIMIT: 100,
  MAX_UPCOMING_RECURRENCES: 3,
  PAID_EXPENSES_LIMIT: 500
} as const;

// ==================== Configuración de Estado de Pago ====================

export interface PaymentStatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info';
  className: string;
}

export const PAYMENT_STATUS_CONFIG: Record<string, PaymentStatusConfig> = {
  [PAYMENT_STATUS.PAID]: {
    label: 'Pagado',
    variant: 'success',
    className: ''
  },
  [PAYMENT_STATUS.PENDING]: {
    label: 'Pendiente',
    variant: 'warning',
    className: ''
  },
  [PAYMENT_STATUS.OVERDUE]: {
    label: 'Vencido',
    variant: 'destructive',
    className: ''
  }
};

// ==================== Helper Functions ====================

/**
 * Obtiene la configuración de badge para un estado de pago
 */
export function getPaymentStatusBadge(
  status: string | null | undefined,
  expenseDate: string
): PaymentStatusConfig & { label: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = expenseDate.split('-').map(Number);
  const expenseDateObj = new Date(year, month - 1, day);
  expenseDateObj.setHours(0, 0, 0, 0);

  const isOverdue = expenseDateObj < today && status !== PAYMENT_STATUS.PAID;
  const daysDiff = Math.floor(
    (expenseDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Si está vencido automáticamente
  if (isOverdue) {
    const daysOverdue = Math.abs(daysDiff);
    return {
      ...PAYMENT_STATUS_CONFIG[PAYMENT_STATUS.OVERDUE],
      label: `Vencido (${daysOverdue}d)`
    };
  }

  // Si es pendiente y está próximo a vencer (menos de 7 días)
  if (status !== PAYMENT_STATUS.PAID && daysDiff >= 0 && daysDiff <= 7) {
    const baseConfig = PAYMENT_STATUS_CONFIG[PAYMENT_STATUS.PENDING];
    return {
      ...baseConfig,
      label: daysDiff === 0 ? 'Vence Hoy' : `Vence en ${daysDiff}d`,
      variant: daysDiff <= 2 ? 'warning' : baseConfig.variant,
      className: ''
    };
  }

  // Estado normal
  const config =
    PAYMENT_STATUS_CONFIG[status as string] ||
    PAYMENT_STATUS_CONFIG[PAYMENT_STATUS.PENDING];
  return { ...config };
}

/**
 * Valida si un estado de pago es válido
 */
export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PAYMENT_STATUS).includes(status as PaymentStatus);
}

/**
 * Valida si una frecuencia es válida
 */
export function isValidRecurrenceFrequency(
  frequency: string
): frequency is RecurrenceFrequency {
  return Object.values(RECURRENCE_FREQUENCY).includes(frequency as RecurrenceFrequency);
}
