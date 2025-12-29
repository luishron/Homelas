'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] text-muted-foreground transition-all hover:text-primary',
        isActive ? 'bg-muted text-primary' : 'transparent'
      )}
    >
      {children}
      {label}
    </Link>
  );
}
