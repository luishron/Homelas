import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Key, Mail } from 'lucide-react';

export default async function SecurityPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seguridad</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la seguridad de tu cuenta
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Contraseña</CardTitle>
          </div>
          <CardDescription>
            Cambia tu contraseña regularmente para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Última actualización: Información no disponible
          </p>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Próximamente: Cambio de contraseña desde la app
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Por ahora, puedes solicitar un cambio de contraseña desde la página de login
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Autenticación</CardTitle>
          </div>
          <CardDescription>
            Método de acceso a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Magic Link (Email)</p>
                <p className="text-sm text-muted-foreground">
                  Accede sin contraseñas usando enlaces mágicos
                </p>
              </div>
              <Button variant="outline" disabled>
                Activado
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Email & Contraseña</p>
                <p className="text-sm text-muted-foreground">
                  Método tradicional de autenticación
                </p>
              </div>
              <Button variant="outline" disabled>
                Activado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <CardTitle>Sesiones Activas</CardTitle>
          </div>
          <CardDescription>
            Dispositivos donde has iniciado sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Próximamente: Gestión de sesiones activas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
