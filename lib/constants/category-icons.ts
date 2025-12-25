/**
 * Sistema de Iconografía Consistente - Wise-inspired
 *
 * Mapeo de categorías a iconos de lucide-react con colores semantic
 * Proporciona consistencia visual en toda la aplicación
 */

export interface CategoryIcon {
  icon: string;           // Nombre del icono de lucide-react
  color: string;          // Color HSL del icono
  bgColor?: string;       // Color de fondo opcional
  description?: string;   // Descripción de la categoría
}

export interface StatusIcon {
  icon: string;
  color: string;
  label: string;
}

/**
 * Iconos de Categorías de Gastos
 *
 * Usa HSL para consistencia con el sistema de diseño
 */
export const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  // Alimentación
  food: {
    icon: 'Utensils',
    color: 'hsl(25 95% 53%)',      // Naranja cálido
    bgColor: 'hsl(25 95% 96%)',
    description: 'Comida y restaurantes'
  },
  groceries: {
    icon: 'ShoppingCart',
    color: 'hsl(142 76% 45%)',     // Verde
    bgColor: 'hsl(142 76% 95%)',
    description: 'Supermercado y abarrotes'
  },

  // Transporte
  transport: {
    icon: 'Car',
    color: 'hsl(217 91% 60%)',     // Azul
    bgColor: 'hsl(217 91% 95%)',
    description: 'Transporte y vehículo'
  },
  gas: {
    icon: 'Fuel',
    color: 'hsl(0 84% 60%)',       // Rojo
    bgColor: 'hsl(0 84% 95%)',
    description: 'Gasolina'
  },
  taxi: {
    icon: 'Taxi',
    color: 'hsl(45 93% 47%)',      // Amarillo
    bgColor: 'hsl(45 93% 95%)',
    description: 'Taxi y Uber'
  },

  // Hogar
  home: {
    icon: 'Home',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Hogar y mantenimiento'
  },
  rent: {
    icon: 'Building2',
    color: 'hsl(240 60% 50%)',     // Índigo
    bgColor: 'hsl(240 60% 95%)',
    description: 'Renta y alquiler'
  },
  utilities: {
    icon: 'Lightbulb',
    color: 'hsl(45 93% 47%)',      // Amarillo
    bgColor: 'hsl(45 93% 95%)',
    description: 'Servicios (luz, agua, gas)'
  },
  internet: {
    icon: 'Wifi',
    color: 'hsl(199 89% 48%)',     // Azul cielo
    bgColor: 'hsl(199 89% 95%)',
    description: 'Internet y telefonía'
  },

  // Compras
  shopping: {
    icon: 'ShoppingBag',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Compras generales'
  },
  clothing: {
    icon: 'Shirt',
    color: 'hsl(330 81% 60%)',     // Rosa
    bgColor: 'hsl(330 81% 95%)',
    description: 'Ropa y accesorios'
  },
  electronics: {
    icon: 'Laptop',
    color: 'hsl(200 90% 50%)',     // Azul tech
    bgColor: 'hsl(200 90% 95%)',
    description: 'Electrónicos y gadgets'
  },

  // Entretenimiento
  entertainment: {
    icon: 'Film',
    color: 'hsl(280 100% 50%)',    // Púrpura brillante
    bgColor: 'hsl(280 100% 95%)',
    description: 'Entretenimiento y ocio'
  },
  streaming: {
    icon: 'Tv',
    color: 'hsl(0 0% 40%)',        // Gris oscuro
    bgColor: 'hsl(0 0% 95%)',
    description: 'Streaming y suscripciones'
  },
  gaming: {
    icon: 'Gamepad2',
    color: 'hsl(270 100% 60%)',    // Púrpura gaming
    bgColor: 'hsl(270 100% 95%)',
    description: 'Videojuegos'
  },

  // Salud
  health: {
    icon: 'Heart',
    color: 'hsl(0 84% 60%)',       // Rojo
    bgColor: 'hsl(0 84% 95%)',
    description: 'Salud y bienestar'
  },
  medical: {
    icon: 'Stethoscope',
    color: 'hsl(199 89% 48%)',     // Azul médico
    bgColor: 'hsl(199 89% 95%)',
    description: 'Consultas y medicinas'
  },
  fitness: {
    icon: 'Dumbbell',
    color: 'hsl(25 95% 53%)',      // Naranja fitness
    bgColor: 'hsl(25 95% 95%)',
    description: 'Gimnasio y deportes'
  },

  // Finanzas
  finance: {
    icon: 'DollarSign',
    color: 'hsl(142 76% 45%)',     // Verde dinero
    bgColor: 'hsl(142 76% 95%)',
    description: 'Finanzas y bancos'
  },
  investment: {
    icon: 'TrendingUp',
    color: 'hsl(217 91% 60%)',     // Azul inversión
    bgColor: 'hsl(217 91% 95%)',
    description: 'Inversiones'
  },
  insurance: {
    icon: 'Shield',
    color: 'hsl(199 89% 48%)',     /* Azul protección */
    bgColor: 'hsl(199 89% 95%)',
    description: 'Seguros'
  },

  // Educación
  education: {
    icon: 'GraduationCap',
    color: 'hsl(217 91% 60%)',     // Azul educación
    bgColor: 'hsl(217 91% 95%)',
    description: 'Educación y cursos'
  },
  books: {
    icon: 'BookOpen',
    color: 'hsl(38 92% 50%)',      // Amber libros
    bgColor: 'hsl(38 92% 95%)',
    description: 'Libros y material'
  },

  // Personal
  personal: {
    icon: 'User',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Cuidado personal'
  },
  gifts: {
    icon: 'Gift',
    color: 'hsl(330 81% 60%)',     // Rosa
    bgColor: 'hsl(330 81% 95%)',
    description: 'Regalos'
  },

  // Viajes
  travel: {
    icon: 'Plane',
    color: 'hsl(199 89% 48%)',     // Azul cielo
    bgColor: 'hsl(199 89% 95%)',
    description: 'Viajes y vacaciones'
  },
  hotel: {
    icon: 'Hotel',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Hoteles y alojamiento'
  },

  // Mascotas
  pets: {
    icon: 'PawPrint',
    color: 'hsl(25 95% 53%)',      // Naranja
    bgColor: 'hsl(25 95% 95%)',
    description: 'Mascotas'
  },

  // Otros
  other: {
    icon: 'MoreHorizontal',
    color: 'hsl(0 0% 50%)',        // Gris neutral
    bgColor: 'hsl(0 0% 95%)',
    description: 'Otros gastos'
  },
  miscellaneous: {
    icon: 'Package',
    color: 'hsl(38 92% 50%)',      // Amber
    bgColor: 'hsl(38 92% 95%)',
    description: 'Misceláneos'
  }
};

/**
 * Iconos de Estados de Transacción
 */
export const TRANSACTION_STATUS_ICONS: Record<string, StatusIcon> = {
  paid: {
    icon: 'CheckCircle2',
    color: 'hsl(142 76% 45%)',     // Verde success
    label: 'Pagado'
  },
  pending: {
    icon: 'Clock',
    color: 'hsl(38 92% 50%)',      // Amber warning
    label: 'Pendiente'
  },
  overdue: {
    icon: 'AlertCircle',
    color: 'hsl(0 84% 60%)',       // Rojo destructive
    label: 'Vencido'
  },
  cancelled: {
    icon: 'XCircle',
    color: 'hsl(0 0% 50%)',        // Gris
    label: 'Cancelado'
  },
  processing: {
    icon: 'Loader2',
    color: 'hsl(199 89% 48%)',     // Azul info
    label: 'Procesando'
  }
};

/**
 * Iconos de Métodos de Pago
 */
export const PAYMENT_METHOD_ICONS: Record<string, CategoryIcon> = {
  cash: {
    icon: 'Wallet',
    color: 'hsl(142 76% 45%)',     // Verde
    bgColor: 'hsl(142 76% 95%)',
    description: 'Efectivo'
  },
  'credit-card': {
    icon: 'CreditCard',
    color: 'hsl(217 91% 60%)',     // Azul
    bgColor: 'hsl(217 91% 95%)',
    description: 'Tarjeta de crédito'
  },
  'debit-card': {
    icon: 'CreditCard',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Tarjeta de débito'
  },
  transfer: {
    icon: 'ArrowLeftRight',
    color: 'hsl(199 89% 48%)',     // Azul
    bgColor: 'hsl(199 89% 95%)',
    description: 'Transferencia'
  },
  paypal: {
    icon: 'Smartphone',
    color: 'hsl(217 91% 60%)',     // Azul PayPal
    bgColor: 'hsl(217 91% 95%)',
    description: 'PayPal'
  },
  other: {
    icon: 'MoreHorizontal',
    color: 'hsl(0 0% 50%)',        // Gris
    bgColor: 'hsl(0 0% 95%)',
    description: 'Otro método'
  }
};

/**
 * Iconos de Categorías de Ingresos
 */
export const INCOME_CATEGORY_ICONS: Record<string, CategoryIcon> = {
  salary: {
    icon: 'Briefcase',
    color: 'hsl(142 76% 45%)',     // Verde
    bgColor: 'hsl(142 76% 95%)',
    description: 'Salario'
  },
  freelance: {
    icon: 'Laptop',
    color: 'hsl(280 65% 60%)',     // Púrpura
    bgColor: 'hsl(280 65% 95%)',
    description: 'Freelance'
  },
  investment: {
    icon: 'TrendingUp',
    color: 'hsl(217 91% 60%)',     // Azul
    bgColor: 'hsl(217 91% 95%)',
    description: 'Inversiones'
  },
  business: {
    icon: 'Store',
    color: 'hsl(25 95% 53%)',      // Naranja
    bgColor: 'hsl(25 95% 95%)',
    description: 'Negocio'
  },
  bonus: {
    icon: 'Gift',
    color: 'hsl(330 81% 60%)',     // Rosa
    bgColor: 'hsl(330 81% 95%)',
    description: 'Bonos y premios'
  },
  rental: {
    icon: 'Home',
    color: 'hsl(199 89% 48%)',     // Azul
    bgColor: 'hsl(199 89% 95%)',
    description: 'Rentas'
  },
  other: {
    icon: 'DollarSign',
    color: 'hsl(142 76% 45%)',     // Verde
    bgColor: 'hsl(142 76% 95%)',
    description: 'Otros ingresos'
  }
};

/**
 * Utilidades para obtener iconos
 */

export function getCategoryIcon(categoryName: string): CategoryIcon {
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_ICONS[normalized] || CATEGORY_ICONS.other;
}

export function getStatusIcon(status: string): StatusIcon {
  const normalized = status.toLowerCase();
  return TRANSACTION_STATUS_ICONS[normalized] || TRANSACTION_STATUS_ICONS.pending;
}

export function getPaymentMethodIcon(method: string): CategoryIcon {
  const normalized = method.toLowerCase().replace(/\s+/g, '-');
  return PAYMENT_METHOD_ICONS[normalized] || PAYMENT_METHOD_ICONS.other;
}

export function getIncomeIcon(categoryName: string): CategoryIcon {
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '-');
  return INCOME_CATEGORY_ICONS[normalized] || INCOME_CATEGORY_ICONS.other;
}

/**
 * Obtener un color aleatorio para nuevas categorías
 */
export function getRandomCategoryColor(): string {
  const colors = [
    'hsl(25 95% 53%)',    // Naranja
    'hsl(142 76% 45%)',   // Verde
    'hsl(217 91% 60%)',   // Azul
    'hsl(280 65% 60%)',   // Púrpura
    'hsl(330 81% 60%)',   // Rosa
    'hsl(199 89% 48%)',   // Azul cielo
    'hsl(38 92% 50%)',    // Amber
    'hsl(0 84% 60%)',     // Rojo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Lista de todos los iconos disponibles (para selector de UI)
 */
export const AVAILABLE_ICONS = Object.keys(CATEGORY_ICONS);
export const AVAILABLE_STATUS_ICONS = Object.keys(TRANSACTION_STATUS_ICONS);
export const AVAILABLE_PAYMENT_ICONS = Object.keys(PAYMENT_METHOD_ICONS);
export const AVAILABLE_INCOME_ICONS = Object.keys(INCOME_CATEGORY_ICONS);
