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
import { signUp } from '@/lib/auth-actions';
import { Mail, Wallet, Zap, Shield, TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for errors from URL params
  const urlError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, fullName);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError('Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
              <Mail className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              ¡Revisa tu email!
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Te enviamos un correo de confirmación a<br />
              <strong className="text-foreground">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Haz clic en el enlace del email para verificar tu cuenta y comenzar a usar Homelas.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Nota:</strong> Revisa también tu carpeta de spam si no ves el email.
              </p>
            </div>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </Link>
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
            Únete a Homelas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comienza a gestionar tus finanzas personales de manera simple y efectiva
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Gratis para siempre</h3>
                <p className="text-sm text-muted-foreground">
                  Plan Free con todas las funciones básicas incluidas
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Sin tarjeta requerida</h3>
                <p className="text-sm text-muted-foreground">
                  Crea tu cuenta en segundos, sin compromisos
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

      {/* Right Panel - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md animate-fade-in border-primary/20 shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-6">
            {/* Mobile logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 lg:hidden">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Crea tu cuenta
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Comienza gratis, sin tarjeta de crédito
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm sm:text-base">
                  Nombre completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 sm:h-12 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 sm:h-12 text-sm sm:text-base transition-all focus:ring-2 focus:ring-primary/20"
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
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Crear cuenta gratis
                  </span>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            <Link href="/login" className="block">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Iniciar sesión
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              Al crear una cuenta, aceptas nuestros{' '}
              <Link href="/terminos" className="text-primary hover:underline">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignUpPage() {
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
      <SignUpForm />
    </Suspense>
  );
}
