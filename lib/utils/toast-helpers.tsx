/**
 * Toast Helpers - Utilidades para toasts mejorados con iconos y estados
 *
 * Wrappers sobre useToast para mostrar notificaciones con mejor UX
 */

import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import type { Toast } from '@/hooks/use-toast';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ShowToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: Toast['action'];
}

/**
 * Crear contenido de toast con icono
 */
export function createToastWithIcon(
  variant: ToastVariant,
  options: ShowToastOptions
) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-destructive" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    loading: <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />,
  };

  const variantStyles = {
    success: 'border-green-500/50 bg-green-50 dark:bg-green-950/20',
    error: 'border-destructive/50',
    warning: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20',
    info: 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20',
    loading: 'border-muted',
  };

  return {
    title: (
      <div className="flex items-center gap-2">
        {icons[variant]}
        <span>{options.title}</span>
      </div>
    ),
    description: options.description,
    duration: options.duration || (variant === 'loading' ? Infinity : 3000),
    action: options.action,
    className: variantStyles[variant],
  };
}

/**
 * Helper functions para cada tipo de toast
 */
export const toastHelpers = {
  success: (toast: any, options: ShowToastOptions) => {
    return toast(createToastWithIcon('success', options));
  },

  error: (toast: any, options: ShowToastOptions) => {
    return toast(createToastWithIcon('error', options));
  },

  warning: (toast: any, options: ShowToastOptions) => {
    return toast(createToastWithIcon('warning', options));
  },

  info: (toast: any, options: ShowToastOptions) => {
    return toast(createToastWithIcon('info', options));
  },

  loading: (toast: any, options: ShowToastOptions) => {
    return toast(createToastWithIcon('loading', options));
  },

  /**
   * Promise toast - Muestra loading, luego success o error
   */
  promise: async <T,>(
    toast: any,
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ): Promise<T> => {
    // Mostrar loading
    const { dismiss } = toast(
      createToastWithIcon('loading', {
        title: messages.loading,
      })
    );

    try {
      const result = await promise;

      // Dismiss loading y mostrar success
      dismiss();
      toast(
        createToastWithIcon('success', {
          title:
            typeof messages.success === 'function'
              ? messages.success(result)
              : messages.success,
        })
      );

      return result;
    } catch (error) {
      // Dismiss loading y mostrar error
      dismiss();
      toast(
        createToastWithIcon('error', {
          title:
            typeof messages.error === 'function'
              ? messages.error(error)
              : messages.error,
        })
      );

      throw error;
    }
  },
};

/**
 * Hook mejorado de toast con helpers
 */
export function useEnhancedToast() {
  const { toast, ...rest } = require('@/hooks/use-toast').useToast();

  return {
    toast,
    success: (options: ShowToastOptions) => toastHelpers.success(toast, options),
    error: (options: ShowToastOptions) => toastHelpers.error(toast, options),
    warning: (options: ShowToastOptions) => toastHelpers.warning(toast, options),
    info: (options: ShowToastOptions) => toastHelpers.info(toast, options),
    loading: (options: ShowToastOptions) => toastHelpers.loading(toast, options),
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => toastHelpers.promise(toast, promise, messages),
    ...rest,
  };
}
