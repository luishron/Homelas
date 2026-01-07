import { getUser } from '@/lib/auth';
import { getUserProfile } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile(user.id);

  // Determinar el badge de plan
  const planBadges = {
    free: { label: 'Gratis', variant: 'secondary' as const },
    pro: { label: 'Pro', variant: 'default' as const },
    plus: { label: 'Plus', variant: 'default' as const },
    admin: { label: 'Admin', variant: 'destructive' as const }
  };

  const planBadge = planBadges[(profile?.role as keyof typeof planBadges) || 'free'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Cuenta</h1>
        <p className="text-muted-foreground mt-2">
          Información de tu cuenta y plan actual
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Datos de tu cuenta en Tallify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nombre completo</label>
            <p className="text-lg font-semibold">{profile?.full_name || 'No especificado'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Plan actual</label>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={planBadge.variant}>{planBadge.label}</Badge>
              {profile?.plan_expires_at && (
                <span className="text-xs text-muted-foreground">
                  Expira: {new Date(profile.plan_expires_at).toLocaleDateString('es-ES')}
                </span>
              )}
            </div>
          </div>
          {profile?.timezone && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Zona horaria</label>
              <p className="text-base">{profile.timezone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade de Plan</CardTitle>
          <CardDescription>
            Desbloquea más funciones con un plan superior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Los planes Pro y Plus incluyen gastos recurrentes automáticos, exportación de datos,
            reportes avanzados y más.
          </p>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Próximamente: Sistema de upgrade de plan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
