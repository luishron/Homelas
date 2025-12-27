'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signIn, signInWithMagicLink } from '@/lib/auth-actions';
import { Mail, Sparkles, Wallet, KeyRound } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for errors from URL params
  const urlError = searchParams.get('error');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to dashboard on success
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signInWithMagicLink(email);

      if (result.error) {
        setError(result.error);
      } else {
        setEmailSent(true);
      }
    } catch (error) {
      setError('Error al enviar el enlace mágico');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Revisa tu email
            </CardTitle>
            <CardDescription className="text-base">
              Te enviamos un enlace mágico a <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">
                Haz clic en el enlace del email para iniciar sesión. El enlace
                expira en 1 hora.
              </p>
            </div>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Enviar otro enlace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Bienvenido</CardTitle>
          <CardDescription className="text-base">
            Elige tu método de inicio de sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(error || urlError) && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
              <p className="text-sm font-medium text-destructive">
                {error || urlError}
              </p>
            </div>
          )}

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="gap-2">
                <KeyRound className="h-4 w-4" />
                Email & Contraseña
              </TabsTrigger>
              <TabsTrigger value="magic" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Magic Link
              </TabsTrigger>
            </TabsList>

            {/* Password Login Tab */}
            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-password" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email-password"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="h-5 w-5" />
                      Iniciar sesión
                    </span>
                  )}
                </Button>
              </form>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Para testing:</strong> testadmin@gmail.com / cualquier contraseña
                </p>
              </div>
            </TabsContent>

            {/* Magic Link Tab */}
            <TabsContent value="magic" className="space-y-4">
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-magic" className="text-base">
                    Email
                  </Label>
                  <Input
                    id="email-magic"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Enviar enlace mágico
                    </span>
                  )}
                </Button>
              </form>

              <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-center text-sm font-medium text-primary">
                  ¿Cómo funciona?
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">1.</span>
                    <span>Ingresa tu email y haz clic en "Enviar"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">2.</span>
                    <span>Revisa tu email y haz clic en el enlace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">3.</span>
                    <span>¡Listo! Acceso automático</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
