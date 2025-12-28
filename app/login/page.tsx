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
import { Mail, Sparkles, Wallet, KeyRound, Zap, Shield, TrendingUp, UserPlus } from 'lucide-react';
import Link from 'next/link';

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
              <Mail className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Revisa tu email
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Te enviamos un enlace mágico a<br />
              <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Haz clic en el enlace del email para iniciar sesión. El enlace
                expira en <strong className="text-foreground">1 hora</strong>.
              </p>
            </div>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full h-11"
            >
              Enviar otro enlace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel - Branding & Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Homelas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gestiona tus finanzas personales de manera simple y efectiva
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Control total</h3>
                <p className="text-sm text-muted-foreground">
                  Rastrea cada gasto e ingreso en tiempo real
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Insights inteligentes</h3>
                <p className="text-sm text-muted-foreground">
                  Visualiza tendencias y proyecciones mensuales
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">100% seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Tus datos protegidos con encriptación de nivel bancario
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6">
            {/* Mobile logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 lg:hidden">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Bienvenido de nuevo
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Inicia sesión para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(error || urlError) && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center animate-shake">
                <p className="text-sm font-medium text-destructive">
                  {error || urlError}
                </p>
              </div>
            )}

            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="password" className="gap-2 text-xs sm:text-sm">
                  <KeyRound className="h-4 w-4" />
                  <span className="hidden sm:inline">Email & Contraseña</span>
                  <span className="sm:hidden">Contraseña</span>
                </TabsTrigger>
                <TabsTrigger value="magic" className="gap-2 text-xs sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  Magic Link
                  <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full hidden sm:inline">
                    Recomendado
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Password Login Tab */}
              <TabsContent value="password" className="space-y-4 mt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-password" className="text-sm sm:text-base">
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
                      className="h-11 sm:h-12 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm sm:text-base">
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
                      className="h-11 sm:h-12 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 sm:h-12 w-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
              </TabsContent>

              {/* Magic Link Tab */}
              <TabsContent value="magic" className="space-y-4 mt-6">
                <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-magic" className="text-sm sm:text-base">
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
                      className="h-11 sm:h-12 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 sm:h-12 w-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">
                      ¿Cómo funciona?
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold text-sm">1.</span>
                      <span>Ingresa tu email y haz clic en "Enviar"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold text-sm">2.</span>
                      <span>Revisa tu email y haz clic en el enlace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold text-sm">3.</span>
                      <span>¡Listo! Acceso automático sin contraseñas</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            <Link href="/registro" className="block">
              <Button variant="outline" className="w-full h-11">
                <UserPlus className="h-4 w-4 mr-2" />
                Crear cuenta gratis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
