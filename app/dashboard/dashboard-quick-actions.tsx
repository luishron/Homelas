'use client';

import Link from 'next/link';
import { Plus, TrendingUp, Send, Wallet } from 'lucide-react';
import { QuickActionCard, QuickActionsContainer } from '@/components/ui/quick-action-card';

interface DashboardQuickActionsProps {
  overdueCount?: number;
}

export function DashboardQuickActions({ overdueCount }: DashboardQuickActionsProps) {
  return (
    <QuickActionsContainer>
      <Link href="/dashboard/gastos">
        <QuickActionCard
          icon={Plus}
          label="Nuevo Gasto"
          iconColor="hsl(var(--destructive))"
          badge={overdueCount && overdueCount > 0 ? overdueCount : undefined}
        />
      </Link>

      <Link href="/dashboard/ingresos">
        <QuickActionCard
          icon={TrendingUp}
          label="Nuevo Ingreso"
          iconColor="hsl(var(--success))"
        />
      </Link>

      <Link href="/dashboard/gastos">
        <QuickActionCard
          icon={Send}
          label="Pagar Gasto"
          iconColor="hsl(var(--primary))"
        />
      </Link>

      <Link href="/dashboard/categorias">
        <QuickActionCard
          icon={Wallet}
          label="Categorías"
          iconColor="hsl(var(--warning))"
        />
      </Link>
    </QuickActionsContainer>
  );
}
