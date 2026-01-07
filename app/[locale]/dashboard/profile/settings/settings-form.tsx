'use client';

import { useState, useTransition } from 'react';
import { type UserProfile } from '@/lib/profiles';
import type { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencySelector } from './currency-selector';
import { updateUserProfile, updateUserPreferences } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon, Settings, CreditCard } from 'lucide-react';
import { type CurrencyCode, DEFAULT_CURRENCY } from '@/lib/config/currencies';
import { inferCurrencyFromTimezone } from '@/lib/config/currencies';

interface SettingsFormProps {
  profile: UserProfile;
  user: User;
}

export function SettingsForm({ profile, user }: SettingsFormProps) {
  const { toast } = useToast();
  const [isPendingProfile, startTransitionProfile] = useTransition();
  const [isPendingPreferences, startTransitionPreferences] = useTransition();

  // Profile states
  const [fullName, setFullName] = useState(profile.full_name || '');

  // Preferences states
  // 1. Preferencia explícita tiene prioridad
  // 2. Si no existe, inferir de timezone
  // 3. Fallback a DEFAULT_CURRENCY
  const initialCurrency = (profile.preferences?.currency as CurrencyCode) ||
                         (profile.timezone ? inferCurrencyFromTimezone(profile.timezone) : DEFAULT_CURRENCY);

  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    (profile.preferences?.theme as 'light' | 'dark' | 'system') || 'system'
  );

  // Check if currency was inferred (not explicitly set)
  const isCurrencyInferred = !profile.preferences?.currency && profile.timezone;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    startTransitionProfile(async () => {
      const formData = new FormData();
      formData.append('fullName', fullName);

      const result = await updateUserProfile(formData);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Perfil actualizado',
          description: 'Los cambios se guardaron correctamente',
        });
      }
    });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    startTransitionPreferences(async () => {
      const formData = new FormData();
      formData.append('currency', currency);
      formData.append('theme', theme);

      const result = await updateUserPreferences(formData);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Preferencias actualizadas',
          description: 'Los cambios se aplicaron correctamente',
        });

        // Recargar la página para aplicar el nuevo formato de moneda
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Sección: Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            <CardTitle>Perfil</CardTitle>
          </div>
          <CardDescription>
            Información básica de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                El email no se puede cambiar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isPendingProfile}
              className="h-11"
            >
              {isPendingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar perfil
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sección: Preferencias */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Preferencias</CardTitle>
          </div>
          <CardDescription>
            Personaliza tu experiencia en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <CurrencySelector
                value={currency}
                onChange={setCurrency}
                disabled={isPendingPreferences}
              />
              {isCurrencyInferred && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Inferida automáticamente desde tu zona horaria
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Esta es la moneda en la que se mostrarán todos los montos
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isPendingPreferences}
              >
                <option value="system">Sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Selecciona el tema de la interfaz
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPendingPreferences}
              className="h-11"
            >
              {isPendingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar preferencias
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sección: Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Plan</CardTitle>
          </div>
          <CardDescription>
            Información sobre tu plan actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan actual</span>
              <Badge variant={profile.plan === 'free' ? 'secondary' : 'default'}>
                {profile.plan === 'free' && 'Free'}
                {profile.plan === 'pro' && 'Pro'}
                {profile.plan === 'plus' && 'Plus'}
                {profile.plan === 'admin' && 'Admin'}
              </Badge>
            </div>

            {profile.plan === 'free' && (
              <div className="text-sm text-muted-foreground">
                <p>El plan Free incluye:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Hasta 10 categorías</li>
                  <li>Gastos ilimitados</li>
                  <li>Ingresos ilimitados</li>
                  <li>Dashboard básico</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
