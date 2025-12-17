import * as React from 'react';
import { Card, CardHeader, CardContent } from './card';
import { cn } from '@/lib/utils';

export interface CardSkeletonProps {
  variant?: 'default' | 'stat' | 'category';
  className?: string;
}

export function CardSkeleton({ variant = 'default', className }: CardSkeletonProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Shimmer animation with brand color */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      {variant === 'stat' && (
        <>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
              <div className="h-10 w-10 rounded-lg bg-primary/10 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-32 bg-muted/50 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 bg-muted/30 rounded animate-pulse" />
          </CardContent>
        </>
      )}

      {variant === 'category' && (
        <>
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 animate-pulse" />
              <div className="h-8 w-8 rounded bg-muted/30 animate-pulse" />
            </div>
            <div className="h-6 w-32 bg-muted/50 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-muted/30 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="relative my-4">
              <div className="h-px w-full bg-muted/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-1 w-12 bg-primary/20 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted/30 rounded animate-pulse" />
              <div className="h-6 w-28 bg-muted/50 rounded animate-pulse" />
            </div>
          </CardContent>
        </>
      )}

      {variant === 'default' && (
        <>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-3 w-48 bg-muted/30 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 w-full bg-muted/30 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-muted/20 rounded animate-pulse" />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
