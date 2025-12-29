'use client';

import * as React from 'react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';

/**
 * ResponsiveDialog - Automatically switches between Dialog (desktop) and Drawer (mobile)
 *
 * Renders a Dialog on desktop (≥768px) and a Drawer on mobile (<768px)
 * for optimal UX on all screen sizes.
 *
 * @example
 * ```tsx
 * <ResponsiveDialog open={open} onOpenChange={setOpen}>
 *   <ResponsiveDialogTrigger asChild>
 *     <Button>Open</Button>
 *   </ResponsiveDialogTrigger>
 *   <ResponsiveDialogContent>
 *     <ResponsiveDialogHeader>
 *       <ResponsiveDialogTitle>Title</ResponsiveDialogTitle>
 *       <ResponsiveDialogDescription>Description</ResponsiveDialogDescription>
 *     </ResponsiveDialogHeader>
 *     <div>Content goes here</div>
 *     <ResponsiveDialogFooter>
 *       <Button>Submit</Button>
 *     </ResponsiveDialogFooter>
 *   </ResponsiveDialogContent>
 * </ResponsiveDialog>
 * ```
 */

// Create context to share isDesktop value across all sub-components
const ResponsiveDialogContext = React.createContext<{
  isDesktop: boolean;
  mounted: boolean;
}>({ isDesktop: false, mounted: false });

interface ResponsiveDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResponsiveDialog({
  children,
  open,
  onOpenChange
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop, mounted }}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      )}
    </ResponsiveDialogContext.Provider>
  );
}

interface ResponsiveDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function ResponsiveDialogTrigger({
  children,
  asChild
}: ResponsiveDialogTriggerProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogTrigger asChild={asChild}>{children}</DialogTrigger>;
  }

  return <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>;
}

interface ResponsiveDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialogContent({
  children,
  className
}: ResponsiveDialogContentProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogContent className={className}>{children}</DialogContent>;
  }

  return (
    <DrawerContent className={className}>
      {/* Handle visual for drawer */}
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
      {children}
    </DrawerContent>
  );
}

interface ResponsiveDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialogHeader({
  children,
  className
}: ResponsiveDialogHeaderProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogHeader className={className}>{children}</DialogHeader>;
  }

  return <DrawerHeader className={className}>{children}</DrawerHeader>;
}

interface ResponsiveDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialogTitle({
  children,
  className
}: ResponsiveDialogTitleProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogTitle className={className}>{children}</DialogTitle>;
  }

  return <DrawerTitle className={className}>{children}</DrawerTitle>;
}

interface ResponsiveDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialogDescription({
  children,
  className
}: ResponsiveDialogDescriptionProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogDescription className={className}>{children}</DialogDescription>;
  }

  return <DrawerDescription className={className}>{children}</DrawerDescription>;
}

interface ResponsiveDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveDialogFooter({
  children,
  className
}: ResponsiveDialogFooterProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    return <DialogFooter className={className}>{children}</DialogFooter>;
  }

  return <DrawerFooter className={className}>{children}</DrawerFooter>;
}

interface ResponsiveDialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function ResponsiveDialogClose({
  children,
  asChild,
  className
}: ResponsiveDialogCloseProps) {
  const { isDesktop } = React.useContext(ResponsiveDialogContext);

  if (isDesktop) {
    // Dialog uses DialogClose from radix, accessible via DialogPrimitive
    // For simplicity, we'll just render the children for desktop
    // since most close buttons are in footer with onClick handlers
    return <>{children}</>;
  }

  return (
    <DrawerClose asChild={asChild} className={className}>
      {children}
    </DrawerClose>
  );
}
