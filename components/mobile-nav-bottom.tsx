'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, FolderOpen, TrendingUp, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavBottom() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/dashboard/gastos', label: 'Gastos', icon: DollarSign },
    { href: '/dashboard/categorias', label: 'Categorías', icon: FolderOpen },
    { href: '/dashboard/ingresos', label: 'Ingresos', icon: TrendingUp },
    { href: '/dashboard/metodos-pago', label: 'Métodos', icon: CreditCard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur sm:hidden">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
