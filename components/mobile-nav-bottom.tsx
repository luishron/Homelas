'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  DollarSign,
  FolderOpen,
  TrendingUp,
  CreditCard,
  MoreHorizontal,
  History,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';

export function MobileNavBottom() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  // Items principales (3 máximo para mejor UX mobile)
  const primaryLinks = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/gastos', label: 'Gastos', icon: DollarSign }
  ];

  // Items secundarios en el menú "Más"
  const moreLinks = [
    {
      href: '/dashboard/ingresos',
      label: 'Ingresos',
      icon: TrendingUp,
      description: 'Registra tus fuentes de ingreso'
    },
    {
      href: '/dashboard/categorias',
      label: 'Categorías',
      icon: FolderOpen,
      description: 'Administra categorías de gastos'
    },
    {
      href: '/dashboard/metodos-pago',
      label: 'Métodos de Pago',
      icon: CreditCard,
      description: 'Configura tarjetas y cuentas'
    },
    {
      href: '/dashboard/gastos/pagados',
      label: 'Gastos Pagados',
      icon: History,
      description: 'Consulta el historial'
    }
  ];

  const handleMoreLinkClick = (href: string) => {
    setMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg shadow-2xl sm:hidden">
        {/* Active indicator - top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          {/* Primary navigation items */}
          {primaryLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all duration-200',
                  'relative',
                  isActive
                    ? 'text-primary scale-105'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                )}
              >
                {/* Active indicator - top dot */}
                {isActive && (
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary animate-pulse" />
                )}

                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 shadow-sm'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <span className="leading-tight">{label}</span>
              </Link>
            );
          })}

          {/* "Más" button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all duration-200',
              'relative',
              'text-muted-foreground hover:text-foreground active:scale-95'
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-all duration-200">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="leading-tight">Más</span>
          </button>
        </div>
      </nav>

      {/* Sheet "Más" - Opciones secundarias */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle>Más opciones</SheetTitle>
            <SheetDescription>
              Accede a todas las funciones de la aplicación
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-2">
            {moreLinks.map(({ href, label, icon: Icon, description }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => handleMoreLinkClick(href)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200',
                    'hover:bg-accent active:scale-[0.98]',
                    isActive && 'bg-primary/10 border border-primary/20'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      isActive ? 'bg-primary/15' : 'bg-muted'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                  </div>

                  <div className="flex-1 text-left">
                    <div className={cn('font-medium', isActive && 'text-primary')}>
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {description}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
