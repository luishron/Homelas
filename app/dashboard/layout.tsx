import Link from 'next/link';
import {
  Home,
  Wallet,
  FolderOpen,
  DollarSign,
  TrendingUp,
  PanelLeft,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import Providers from './providers';
import { NavItem } from './nav-item';
import { MobileNavBottom } from '@/components/mobile-nav-bottom';
import { QuickAddFAB } from './quick-add-fab';
import { getCategoriesByUser, getPaymentMethodsByUser, getExpensesByUser, getIncomesByUser } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { GlobalSearchProvider, GlobalSearchTrigger } from '@/components/global-search-provider';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Obtener datos para Quick Add y búsqueda global
  const user = await getUser();
  const categories = user ? await getCategoriesByUser(user.id) : [];
  const paymentMethods = user ? await getPaymentMethodsByUser(user.id) : [];

  // Datos para búsqueda global
  const { expenses } = user ? await getExpensesByUser(user.id, { limit: 100 }) : { expenses: [] };
  const incomes = user ? await getIncomesByUser(user.id) : [];

  const searchData = {
    expenses,
    incomes,
    categories,
    paymentMethods
  };

  return (
    <Providers>
      <GlobalSearchProvider data={searchData}>
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
          <DesktopNav />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MobileNav />
              <DashboardBreadcrumb />
              <GlobalSearchTrigger />
              <div className="ml-auto" />
              <User />
            </header>
            <main className="grid flex-1 items-start gap-2 p-3 pb-20 sm:p-4 sm:pb-0 sm:px-6 sm:py-0 md:gap-4">
              {children}
            </main>
          </div>
          <MobileNavBottom />

          {/* Quick Add Flotante */}
          <QuickAddFAB categories={categories} paymentMethods={paymentMethods} />

          <Analytics />
        </main>
      </GlobalSearchProvider>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
      <div className="flex h-full flex-col gap-2">
        {/* Logo/Brand - Estilo shadcn limpio */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg">homelas</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavItem href="/dashboard" label="Dashboard">
              <Home className="h-4 w-4" />
            </NavItem>

            <NavItem href="/dashboard/gastos" label="Gastos">
              <DollarSign className="h-4 w-4" />
            </NavItem>

            <NavItem href="/dashboard/categorias" label="Categorías">
              <FolderOpen className="h-4 w-4" />
            </NavItem>

            <NavItem href="/dashboard/metodos-pago" label="Métodos de Pago">
              <CreditCard className="h-4 w-4" />
            </NavItem>

            <NavItem href="/dashboard/ingresos" label="Ingresos">
              <TrendingUp className="h-4 w-4" />
            </NavItem>
          </nav>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/gastos', label: 'Gastos', icon: DollarSign },
    { href: '/dashboard/categorias', label: 'Categorías', icon: FolderOpen },
    { href: '/dashboard/metodos-pago', label: 'Métodos de Pago', icon: CreditCard },
    { href: '/dashboard/ingresos', label: 'Ingresos', icon: TrendingUp }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          {/* Logo/Brand - Estilo shadcn limpio */}
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg">homelas</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-auto py-4">
            <div className="grid gap-1 px-2 text-sm font-medium">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      isActive ? 'bg-muted text-primary' : 'transparent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>homelas</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
